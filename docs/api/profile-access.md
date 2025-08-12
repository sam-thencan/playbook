## GET /api/profile/access

Returns whether the current user has purchased access.

Auth: Optional (unauthenticated → `{ hasAccess: false }`)

Response: `{ hasAccess: boolean }`

Example:
```bash
curl http://localhost:3000/api/profile/access -H 'Cookie: <supabase-session-cookies>'
```

See: `src/app/api/profile/access/route.ts`


