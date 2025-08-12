## POST /api/checkout

Creates a Stripe Checkout session and redirects the user to Stripe.

Auth: Required

Body: none (form POST)

Response:
- 303 redirect to Stripe Checkout URL

Notes:
- Sets `client_reference_id` and `metadata.supabase_user_id` to current user id.
- Success URL: `/pay/return?session_id={CHECKOUT_SESSION_ID}`

Example:
```bash
curl -i -X POST http://localhost:3000/api/checkout \
  -H 'Cookie: <supabase-session-cookies>'
```

See: `src/app/api/checkout/route.ts`


