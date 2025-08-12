## Paywall Flow

### Overview
Unpaid users are redirected to `/pay` by Edge middleware for most protected paths. Purchase flips `profiles.has_access` via Stripe webhook, after which the user is allowed through.

### Sequence
```mermaid
sequenceDiagram
  participant U as User
  participant M as Middleware
  participant C as Checkout API
  participant St as Stripe
  participant W as Webhook API
  participant DB as Supabase
  U->>M: GET /lesson/day-1
  M->>DB: profiles.has_access?
  alt false
    M-->>U: 302 /pay
    U->>C: POST /api/checkout
    C-->>U: 303 https://checkout.stripe.com/...
    St-->>W: POST /api/stripe/webhook (session.completed)
    W->>DB: profiles.has_access = true
    U->>app: /pay/return (poll /api/profile/access)
    app->>DB: has_access?
    app-->>U: redirect /dashboard
  else true
    M-->>U: Continue
  end
```

### Key files
- `src/middleware.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/app/pay/return/page.tsx`


