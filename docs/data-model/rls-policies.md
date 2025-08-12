## Row-Level Security (RLS) Policies

RLS is enabled on all user data tables. Admin bypass uses `public.is_admin()`.

### profiles
- Select: `id = auth.uid() or public.is_admin()`
- Update: same predicate; trigger prevents role escalation unless admin

### lessons
- Select: allowed for `authenticated` (read‑only content)
- All write operations: `public.is_admin()`

### progress
- Select/Update/Delete: `user_id = auth.uid() or public.is_admin()`
- Insert: with check `user_id = auth.uid() or public.is_admin()`

### offers
- Select: `active = true` (to authenticated)
- All write operations: `public.is_admin()`

### events
- Select: `user_id = auth.uid() or public.is_admin()`
- Insert: with check `user_id = auth.uid() or public.is_admin()`
- Delete: `public.is_admin()`

### Views
Views (`user_completion`, `perk_unlocks`) read from base tables; base tables' policies apply.

### Service Role usage
Only on server:
- Stripe webhook to update `profiles.has_access`
- Storage uploads for lesson images


