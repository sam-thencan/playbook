## POST /api/stripe/webhook

Stripe webhook handler for checkout session completion.

Auth: Signature (`STRIPE_WEBHOOK_SECRET`)

Behavior:
- Verifies signature and parses event
- On `checkout.session.completed`, updates `profiles.has_access=true` for user id from `client_reference_id`/`metadata`
- Inserts an event record with `purchase_completed` metadata

Example (Stripe CLI):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

See: `src/app/api/stripe/webhook/route.ts`


