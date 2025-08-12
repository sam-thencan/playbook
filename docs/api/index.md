## API Index

All routes live under `src/app/api/**/route.ts` unless noted. Auth is via Supabase SSR cookies.

### Auth and access
- `GET /api/auth/callback` — OAuth handler; exchanges `code` for a session and redirects
- `GET /api/profile/access` — `{ hasAccess: boolean }`

### Checkout and webhooks
- `POST /api/checkout` — Creates Stripe Checkout session and 303 redirects to Stripe
- `POST /api/stripe/webhook` — Verifies event and sets `profiles.has_access=true` on purchase

### Lessons
- `GET /api/lessons/search?q=&tag=&limit=` — Search by title/body_text/tags_text; filter by tags
- `GET /api/lessons/by-id?id=` — Fetch lesson by id (extended columns when available)
- `POST /api/lessons/image-upload` — Upload image to `lessons` storage bucket (service role)

### Progress
- `POST /api/progress/complete` — Upsert 100% completion for a lesson; JSON or form body; 303 to next lesson on form POST

### Favorites
- `GET /api/favorites` — List current user's favorites with lesson info
- `POST /api/favorites` — Toggle favorite for a `lessonId`

### Offers/Perks
- `GET /api/offers/by-id?id=` — Admin edit form support
- `POST /api/perks/redeem` — Record redemption and 303 to CTA or `/perks`

### Admin (requires `profiles.role='admin'`)
- `POST /api/admin/lessons` — Create lesson
- `PATCH /api/admin/lessons/[id]` — Update lesson
- `DELETE /api/admin/lessons/[id]` — Delete lesson
- `POST /api/admin/offers` — Create offer
- `PATCH /api/admin/offers/[id]` — Update offer
- `DELETE /api/admin/offers/[id]` — Delete offer

### Status
- `GET /api/status/db` — Auth check and presence of new columns; feature flag for schema
- `GET /status` — Edge status (service name, time, commit)

See per‑endpoint pages for request/response details and examples.


