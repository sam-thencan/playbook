## Favorites API

### GET /api/favorites
Auth: Required

Response: `{ items: Array<{ id, slug, title, day? }> }`

### POST /api/favorites
Auth: Required

Body: JSON `{ lessonId: string }`

Response: `{ favorited: boolean }`

Examples:
```bash
curl http://localhost:3000/api/favorites -H 'Cookie: <supabase-session-cookies>'

curl -X POST http://localhost:3000/api/favorites \
  -H 'content-type: application/json' \
  -H 'Cookie: <supabase-session-cookies>' \
  -d '{"lessonId":"<uuid>"}'
```

See: `src/app/api/favorites/route.ts`


