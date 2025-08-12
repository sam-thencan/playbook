## GET /api/auth/callback

Handles Supabase OAuth redirects. Exchanges `code` for a session and redirects to `redirect` param or `/dashboard`.

Auth: No (public), but writes auth cookies.

Query params:
- `code` (from Supabase)
- `redirect` (optional; default `/dashboard`)

Response:
- 303 redirect to `redirect`

Example:
```bash
open "$(printf 'http://localhost:3000/api/auth/callback?code=%s&redirect=%%2Fdashboard' "$CODE")"
```

See: `src/app/api/auth/callback/route.ts`


