## Offers and Perks

### Unlock mechanics
- `offers.unlock_rule`: `day` | `percent` | `both`
- SQL view `perk_unlocks` computes `unlocked:boolean` and a human `reason` per user/offer.

### User experience
- `/perks` page reads `user_completion` and `perk_unlocks`, then lists active offers with unlock state and a `Redeem` form when unlocked.
- `POST /api/perks/redeem` logs an `offer_redeemed` event and 303 redirects to CTA URL (external or relative) or back to `/perks`.

### Code touchpoints
- Page: `src/app/perks/page.tsx`
- API: `src/app/api/perks/redeem/route.ts`
- Data: `public.offers`, `public.perk_unlocks` (view)


