## Stack and Architecture

### Stack
- **Framework**: Next.js App Router (RSC + SSR)
- **UI**: React 19, Tailwind v4, custom components (`Card`, `Button`, `ProgressRing`, `Pill`, `WeekAccordion`, etc.)
- **Auth/DB**: Supabase (Auth, PostgREST, Storage), RLS policies in `supabase/schema.sql`
- **Payments**: Stripe Checkout and Webhooks

### Key modules
- `src/lib/supabaseClient.ts`: Browser client (`createBrowserClient`) for client auth flows; syncs session cookies for SSR.
- `src/lib/supabaseServer.ts`: SSR server client using `cookies()` to maintain session across RSC/API.
- `src/middleware.ts`: Edge middleware for route gating (auth + paywall + admin role check).
- Pages: `src/app/dashboard/page.tsx`, `src/app/lesson/[slug]/page.tsx`, etc.
- API routes: under `src/app/api/**/route.ts`.

### Request lifecycle (SSR auth)
```mermaid
sequenceDiagram
  participant B as Browser
  participant M as Edge Middleware
  participant N as Next.js (RSC/SSR)
  participant S as Supabase (PostgREST)
  B->>M: Request /dashboard
  M->>S: getUser() using SSR cookies
  alt unauthenticated
    M-->>B: 302 /login?redirect=/dashboard
  else authenticated
    M-->>B: Continue
    B->>N: /dashboard
    N->>S: Data fetch with SSR client
    S-->>N: Rows
    N-->>B: HTML
  end
```

### Paywall decision points
```mermaid
flowchart TD
  A[Request protected path] --> B{Auth?}
  B -- No --> L[302 /login?redirect=...]
  B -- Yes --> C{Admin path?}
  C -- Yes --> D[Check profiles.role]
  D -- ≠ admin --> H[302 /dashboard]
  D -- admin --> I[Continue]
  C -- No --> E{Is pay route or auth callback?}
  E -- Yes --> I[Continue]
  E -- No --> F[Check profiles.has_access]
  F -- false --> G[302 /pay]
  F -- true --> I[Continue]
```

### Data access patterns
- Use the SSR client in server components and API routes to respect the user’s session and RLS.
- Favor SQL views for derived data (e.g., `user_completion`, `perk_unlocks`) and keep UI logic thin.
- For service operations (Stripe webhook, Storage uploads), use the Service Role key server‑side only.

### Source-of-truth locations
- Auth + Sessions: Supabase Auth and cookies handled via `@supabase/ssr`.
- Paywall: `src/middleware.ts`.
- DB schema, triggers, RLS: `supabase/schema.sql`.
- Payment integration: `src/app/api/checkout/route.ts`, `src/app/api/stripe/webhook/route.ts`.
- Event logging: `public.events` from pages and API routes.


