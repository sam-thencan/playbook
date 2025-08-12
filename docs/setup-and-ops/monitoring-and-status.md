## Monitoring and Status

### Endpoints
- `GET /status` — Edge status and commit SHA
- `GET /api/status/db` — Auth + schema feature check for new columns; useful as a migration smoke test after deploy

### Stripe
- Use Stripe dashboard + CLI to monitor webhook events; ensure network retries are successful.


