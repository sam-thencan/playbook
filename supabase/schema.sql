-- 30-Day Local SEO Playbook – Supabase Schema
-- Includes: users (profiles), lessons, progress, offers, events
-- Auth: Supabase Auth (email/password). Profiles mirror auth.users.

-- Extensions
create extension if not exists "pgcrypto";

-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- (moved is_admin() definition to after profiles table is created)

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'offer_type') then
    create type public.offer_type as enum ('call', 'download', 'discount');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_type') then
    create type public.event_type as enum (
      'login',
      'lesson_viewed',
      'lesson_started',
      'lesson_completed',
      'offer_unlocked',
      'offer_redeemed',
      'streak_incremented'
    );
  end if;
end$$;

-- USERS (profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Helper: check if current user is admin (defined after profiles exists)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- Keep email in sync on auth.users change (optional best-effort)
create or replace function public.handle_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email, updated_at = timezone('utc'::text, now())
  where id = new.id;
  return new;
end;
$$;

-- Auto-create profile on new auth.user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Prevent non-admins from escalating role in profiles
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if not public.is_admin() and new.role is distinct from old.role then
    raise exception 'Not allowed to change role';
  end if;
  return new;
end;
$$;

-- Triggers on auth.users to maintain profiles
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email on auth.users
for each row execute procedure public.handle_email_change();

-- Trigger to protect role updates and maintain updated_at
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_profiles_prevent_role_escalation on public.profiles;
create trigger trg_profiles_prevent_role_escalation
before update on public.profiles
for each row execute procedure public.prevent_role_escalation();

alter table public.profiles enable row level security;

-- RLS policies for profiles
drop policy if exists "Profiles: users can view own" on public.profiles;
create policy "Profiles: users can view own"
on public.profiles
for select
using (
  id = auth.uid() or public.is_admin()
);

drop policy if exists "Profiles: users can update own" on public.profiles;
create policy "Profiles: users can update own"
on public.profiles
for update
using (
  id = auth.uid() or public.is_admin()
)
with check (
  id = auth.uid() or public.is_admin()
);

-- LESSONS
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  day smallint, -- null for intro/bonus
  is_intro boolean not null default false,
  is_bonus boolean not null default false,
  title text not null,
  body jsonb not null default '[]'::jsonb, -- rich body blocks
  resources jsonb not null default '[]'::jsonb, -- array of {label, url}
  estimated_minutes integer, -- estimated time to complete
  sort_order integer not null default 0,
  cta jsonb, -- optional {label, url}
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint lessons_day_bounds check (day is null or (day between 0 and 30))
);

-- Only one non-bonus, non-intro lesson per day
create unique index if not exists idx_lessons_day_unique
on public.lessons (day)
where day is not null and is_intro = false and is_bonus = false;

-- Only one intro lesson
create unique index if not exists idx_lessons_intro_unique
on public.lessons ((true))
where is_intro = true;

-- updated_at trigger
drop trigger if exists trg_lessons_updated_at on public.lessons;
create trigger trg_lessons_updated_at
before update on public.lessons
for each row execute procedure public.set_updated_at();

alter table public.lessons enable row level security;

-- RLS: All authenticated users can read lessons; only admins can write
drop policy if exists "Lessons: read for authenticated" on public.lessons;
create policy "Lessons: read for authenticated"
on public.lessons
for select
to authenticated
using (true);

drop policy if exists "Lessons: admin write" on public.lessons;
create policy "Lessons: admin write"
on public.lessons
for all
using (public.is_admin())
with check (public.is_admin());

-- PROGRESS
create table if not exists public.progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  percent_complete integer not null default 0 check (percent_complete between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  last_viewed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, lesson_id)
);

drop trigger if exists trg_progress_updated_at on public.progress;
create trigger trg_progress_updated_at
before update on public.progress
for each row execute procedure public.set_updated_at();

alter table public.progress enable row level security;

drop policy if exists "Progress: read own or admin" on public.progress;
create policy "Progress: read own or admin"
on public.progress
for select
using (
  user_id = auth.uid() or public.is_admin()
);

drop policy if exists "Progress: upsert own" on public.progress;
create policy "Progress: upsert own"
on public.progress
for insert
with check (
  user_id = auth.uid() or public.is_admin()
);

drop policy if exists "Progress: update own" on public.progress;
create policy "Progress: update own"
on public.progress
for update
using (
  user_id = auth.uid() or public.is_admin()
)
with check (
  user_id = auth.uid() or public.is_admin()
);

drop policy if exists "Progress: delete own or admin" on public.progress;
create policy "Progress: delete own or admin"
on public.progress
for delete
using (
  user_id = auth.uid() or public.is_admin()
);

-- OFFERS
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type public.offer_type not null,
  unlock_day smallint, -- unlock when reaching this lesson day (Intro = 0 if desired)
  unlock_percent integer, -- unlock when reaching this % overall completion
  sort_order integer not null default 0,
  cta jsonb, -- optional {label, url}
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint offers_unlock_bounds check (
    (unlock_day is null or (unlock_day between 0 and 30)) and
    (unlock_percent is null or (unlock_percent between 0 and 100))
  )
);

drop trigger if exists trg_offers_updated_at on public.offers;
create trigger trg_offers_updated_at
before update on public.offers
for each row execute procedure public.set_updated_at();

alter table public.offers enable row level security;

drop policy if exists "Offers: read for authenticated" on public.offers;
create policy "Offers: read for authenticated"
on public.offers
for select
to authenticated
using (active = true);

drop policy if exists "Offers: admin write" on public.offers;
create policy "Offers: admin write"
on public.offers
for all
using (public.is_admin())
with check (public.is_admin());

-- EVENTS (analytics + unlock/redeem logs)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type public.event_type not null,
  lesson_id uuid references public.lessons(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_events_user_created_at on public.events (user_id, created_at desc);
create index if not exists idx_events_type on public.events (event_type);

alter table public.events enable row level security;

drop policy if exists "Events: read own or admin" on public.events;
create policy "Events: read own or admin"
on public.events
for select
using (
  user_id = auth.uid() or public.is_admin()
);

drop policy if exists "Events: insert self" on public.events;
create policy "Events: insert self"
on public.events
for insert
with check (
  user_id = auth.uid() or public.is_admin()
);

drop policy if exists "Events: delete admin" on public.events;
create policy "Events: delete admin"
on public.events
for delete
using (public.is_admin());

-- Optional helper view: overall completion percentage per user
create or replace view public.user_completion as
select
  p.id as user_id,
  case when l.count_total = 0 then 0
       else round(100.0 * coalesce(pc.count_completed, 0) / l.count_total)::int
  end as percent_complete
from public.profiles p
cross join (
  select count(*)::int as count_total from public.lessons where is_intro = false and is_bonus = false and published = true
) l
left join (
  select user_id, count(*)::int as count_completed
  from public.progress
  where completed_at is not null
  group by user_id
) pc on pc.user_id = p.id;
-- Note: Do not alter view owner explicitly in Supabase migrations
-- to avoid permission issues across environments.
-- RLS for view isn't applicable; base tables' policies apply.


