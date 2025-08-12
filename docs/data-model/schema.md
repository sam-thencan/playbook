## Data Model (Supabase)

Schema lives in `supabase/schema.sql`. Highlights below; see file for full DDL (constraints, triggers, indexes).

### profiles
- `id uuid` PK, references `auth.users`
- `email text unique`
- `role text` in {'user','admin'}
- `has_access boolean` paywall flag
- `created_at`, `updated_at`

Policies: users can select/update own row; admins can act on all. Role escalation prevented by trigger.

### lessons
- `id uuid` PK
- `slug text unique`
- `day smallint` (nullable for intro/bonus)
- `is_intro boolean`, `is_bonus boolean`
- `title text`
- `body jsonb` rich blocks
- `resources jsonb` array of `{label,url}`
- `estimated_minutes integer`
- `category text` (optional UI hint)
- `tags text[]`, `tags_text text`
- `body_text text` derived from `body`
- `sort_order integer`, `cta jsonb`, `published boolean`
- Triggers: `lessons_set_body_text` computes `body_text` and `tags_text`

Indexes: trigram on title/body_text/tags_text, GIN on tags, simple on category. Uniqueness on intro and day.

### progress
- Composite PK `(user_id, lesson_id)`
- `percent_complete int` (0..100)
- `started_at`, `completed_at`, `last_viewed_at`

Policies: users act on own rows; admins can act on all.

### offers
- `id uuid` PK
- `title`, `description`, `type enum('call','download','discount')`
- Unlock rules: `unlock_day`, `unlock_percent`, `unlock_rule enum('day','percent','both')`
- `sort_order`, `cta jsonb`, `label text`, `active boolean`

Policies: select for authenticated when `active=true`; admin write.

### events
- `id uuid` PK
- `user_id uuid` → `profiles`
- `event_type enum` (see Events Taxonomy)
- Optional `lesson_id`, `offer_id`
- `metadata jsonb`, `created_at`

Policies: select own or admin; insert self; delete admin.

### Views
- `user_completion(user_id, percent_complete)` → percent completed based on `progress` vs published non‑intro/non‑bonus lessons.
- `perk_unlocks(user_id, offer_id, unlocked, reason)` → evaluates unlock based on day/percent/both.

### Storage
- Public bucket `lessons` for lesson images. Upload via service role on `POST /api/lessons/image-upload`.


