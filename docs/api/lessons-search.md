## GET /api/lessons/search

Search lessons by title/body or filter by tags.

Auth: Required

Query params:
- `q` (optional): search text; matches `title`, `body_text`, `tags_text`
- `tag` (repeatable): filter where `tags` contains all provided tags
- `limit` (default 50, max 100)

Response: array of lesson summaries `{ id, slug, title, day, is_intro, is_bonus, category, tags }`

Example:
```bash
curl 'http://localhost:3000/api/lessons/search?q=GBP&tag=Local&limit=10' \
  -H 'Cookie: <supabase-session-cookies>'
```

See: `src/app/api/lessons/search/route.ts`


