## ADR-0003: RLS + Service Role Usage

Context: RLS must protect user data while enabling system operations such as payment webhooks and storage uploads.

Decision: Enable RLS everywhere and use Service Role key only in server‑side routes that require elevated privileges (Stripe webhook, image upload). Keep all other queries on SSR client with user session.

Consequences: Least privilege by default; clear separation between user‑context queries and system operations.

References: `src/app/api/stripe/webhook/route.ts`, `src/app/api/lessons/image-upload/route.ts`.


