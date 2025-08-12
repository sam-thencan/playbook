## Contributing

### Documentation conventions
- Keep docs in `docs/`, use relative links.
- Use Mermaid for diagrams (` ```mermaid ` fences).
- Prefer small, task‑oriented pages; link from `docs/overview.md`.

### Code conventions
- Use SSR Supabase client on server; browser client only in client components.
- Respect RLS and avoid service role except where noted.
- Tailwind: neutral palette + orange accent (`#FF6A00`), radius 10px.

### PR checklist
- Update docs if public behavior or schema changes.
- If adding schema fields: write migration first, then update API/UI.


