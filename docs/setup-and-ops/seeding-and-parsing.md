## Seeding and Parsing Lessons

### Parse PDF to JSON
- Script: `scripts/parse-playbook.ts`
- Input: `30-day-local-seo-playbook.pdf`
- Output: `supabase/seed-lessons.json`
- Run: `npm run seed:parse`

Parses headings (Intro, Day X, Bonus), infers lists and headings, extracts YouTube URLs, and emits block JSON.

### Seed to Supabase
- Script: `scripts/seed-lessons.ts`
- Uses service role key; merges (`upsert`) lessons by `slug`.
- Adds a video block as the first block if `featured_video` exists.
- Run: `npm run seed:lessons`


