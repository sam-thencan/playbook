## Environment Variables

Required for local/dev/prod (where applicable):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (public)
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server‑only; webhooks, storage)
- `STRIPE_SECRET_KEY` — Server key for creating Checkout sessions
- `STRIPE_WEBHOOK_SECRET` — Shared secret to verify webhooks
- `STRIPE_PRICE_ID` — Price ID for Checkout line item
- `NEXT_PUBLIC_SITE_URL` — Base origin for OAuth callback and success URLs

Locations in code: `src/lib/supabase*`, `src/app/api/**/route.ts`, `scripts/**`.


