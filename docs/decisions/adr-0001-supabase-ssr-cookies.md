## ADR-0001: Supabase SSR Cookies for Auth

Context: RSC/SSR pages and API routes need access to the current session for RLS.

Decision: Use `@supabase/ssr` to create browser and server clients that synchronize auth cookies. Middleware and server components call `auth.getUser()` with SSR cookies.

Consequences: Consistent session across middleware, server components, and API routes. Avoids passing tokens manually.

References: `src/lib/supabaseClient.ts`, `src/lib/supabaseServer.ts`.


