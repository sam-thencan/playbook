## ADR-0002: Paywall in Edge Middleware

Context: Paywall must apply uniformly to server components and API routes without duplicating checks.

Decision: Centralize gating in `src/middleware.ts` to check auth and `profiles.has_access` before hitting pages. Allow `/pay`, `/api/checkout`, and `/api/auth/callback` to flow through.

Consequences: Simple mental model; consistent redirects; minimal leakage of unpaid users into protected UI.

References: `src/middleware.ts`, `src/app/pay/*`, `src/app/api/checkout/route.ts`, `src/app/api/stripe/webhook/route.ts`.


