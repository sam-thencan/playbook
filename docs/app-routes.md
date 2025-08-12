## App Routes Map

High-level map of UI routes, access level, and data sources.

### Public
- `/` — Redirects to `/dashboard` if authenticated, otherwise `/login` (see `src/app/page.tsx`).
- `/login` — Email/password and OAuth login (client component). On success, navigate to redirect target.
- `/status` — Edge status JSON (service, time, commit).

### Paywall and purchase
- `/pay` — Explains offer and posts to `POST /api/checkout`.
- `/pay/return` — Client page that polls `GET /api/profile/access` and redirects to `/dashboard` when access is granted.

### Authenticated user
- `/dashboard` — SSR. Shows overall progress, streak, outline (weeks), and favorites row. Data: `user_completion`, `lessons`, `progress`, `favorites`, `perk_unlocks`.
- `/lesson/[slug]` — SSR. Loads lesson blocks and metadata. Logs `lesson_viewed`. Computes prev/next, sidebar grouping, completed slugs, and offer unlock state (first active offer).
- `/favorites` — SSR. Lists favorites; if `has_access=false`, renders paywall CTA.
- `/perks` — SSR. Shows active offers with unlock state from `perk_unlocks`. If unlocked, renders redeem form.

### Admin (role: admin)
- `/admin/lessons` — List lessons with actions (Edit/Delete).
- `/admin/lessons/edit` — Create or edit a lesson. Loads `/api/lessons/by-id` when `?id=`.
- `/admin/offers` — List offers with actions.
- `/admin/offers/edit` — Create or edit an offer. Loads `/api/offers/by-id` when `?id=`.
- `/admin/events` — Table view of recent `events` with user email and metadata.

Access control enforced centrally by `src/middleware.ts`.


