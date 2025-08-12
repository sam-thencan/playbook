## Deployment

### Vercel
- Configure project with `NEXT_PUBLIC_*` vars; store server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`) as encrypted envs.
- Edge middleware runs on Vercel Edge; Stripe webhook must run on Node runtime — already configured via `export const runtime = 'nodejs'` in the route.

### Post-deploy checks
- `GET /status` returns `ok: true` and commit SHA.
- `GET /api/status/db` with an authenticated session returns `{ columns: { category_tags_present: true } }`.
- Stripe webhook endpoint is reachable and healthy (verify via Stripe CLI test event).


