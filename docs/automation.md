## Documentation Automation (future work)

Potential generators to keep docs current:

- Route index generator: scan `src/app/**/route.ts` and emit `docs/api/index.md`.
- Env var catalog: grep `process.env` usage to produce `docs/setup-and-ops/env-vars.md`.
- Schema parser: transform `supabase/schema.sql` into structured JSON to render tables and a Mermaid ERD.
- OpenAPI skeleton: infer from file paths and methods to create `docs/api/openapi.yaml`.

These can run in CI to fail PRs when docs drift.


