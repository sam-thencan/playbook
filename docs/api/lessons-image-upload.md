## POST /api/lessons/image-upload

Upload a lesson image to the `lessons` public storage bucket. Uses Supabase Service Role on the server.

Auth: Server only (no user context required, but route is protected by environment keys)

Body: `multipart/form-data` with `file`

Response: `{ url }` — public URL of the uploaded image

Example:
```bash
curl -X POST http://localhost:3000/api/lessons/image-upload \
  -F file=@/path/to/image.jpg
```

See: `src/app/api/lessons/image-upload/route.ts`


