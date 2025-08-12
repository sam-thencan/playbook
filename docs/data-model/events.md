## Events Taxonomy

The `public.events` table logs key user actions for analytics and product behavior.

### Types (enum)
- `login`
- `lesson_viewed`
- `lesson_started`
- `lesson_completed`
- `offer_unlocked`
- `offer_redeemed`
- `streak_incremented` (reserved)

### Producers in code
- `lesson_viewed`: `src/app/lesson/[slug]/page.tsx` after load (if authenticated)
- `lesson_completed`: `POST /api/progress/complete` on success
- `offer_unlocked`: `src/app/lesson/[slug]/page.tsx` when unlock condition met
- `offer_redeemed`: `POST /api/perks/redeem` (includes CTA metadata)
- `purchase_completed`: Recorded in `POST /api/stripe/webhook` (stored under `event_type` via metadata/log row in this codebase)

Each event includes `user_id`, optional `lesson_id`/`offer_id`, and a `metadata jsonb` envelope for context (e.g., `{ slug }`, `{ session_id }`, `{ cta }`).


