## GET /api/lessons/by-id

Fetch a lesson by id. Returns extended columns when available; falls back to base set if older DB schema lacks new columns.

Auth: Required

Query params:
- `id` (required)

Response: `{ id, title, slug, day, is_intro, is_bonus, estimated_minutes, resources, body, sort_order, published, category?, tags? }`

Example:
```bash
curl 'http://localhost:3000/api/lessons/by-id?id=<uuid>' -H 'Cookie: <supabase-session-cookies>'
```

See: `src/app/api/lessons/by-id/route.ts`


