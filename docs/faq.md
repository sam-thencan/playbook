## FAQ

### Why does the paywall live in middleware?
To enforce gating uniformly before pages render and without duplicating checks across routes.

### Can I use OAuth providers besides Google?
Yes. Add the provider in Supabase and wire the client button to `signInWithOAuth` on `/login`.

### How do I add a new lesson?
Use the Admin > Lessons UI. See also `docs/app-flows/lesson-consumption.md` for body blocks and tags.

### Where do I change the unlock logic for perks?
In SQL view `perk_unlocks` and in `public.offers` rows; the UI reads those results.


