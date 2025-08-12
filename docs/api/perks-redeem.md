## POST /api/perks/redeem

Record redemption of an unlocked offer and redirect to CTA.

Auth: Required

Body:
- JSON: `{ "offerId": "uuid" }`
- or form: `offerId=uuid`

Response:
- 303 redirect to CTA URL if valid; otherwise JSON `{ ok: true }` for JSON requests or 303 `/perks` for form

See: `src/app/api/perks/redeem/route.ts`


