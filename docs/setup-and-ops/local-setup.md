## Local Setup

### Prerequisites
- Node 18+
- Supabase project (hosted) with schema from `supabase/schema.sql`
- Stripe account + test keys

### Steps
1. Clone repo and install deps:
   - `npm install`
2. Create `.env.local` with values listed in [env-vars.md](./env-vars.md).
3. Seed lessons (optional): see [seeding-and-parsing.md](./seeding-and-parsing.md).
4. Run dev server: `npm run dev` and open `http://localhost:3000`.

### Stripe webhook (local)
- Install Stripe CLI and run:
  - `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Set `STRIPE_WEBHOOK_SECRET` from CLI output.


