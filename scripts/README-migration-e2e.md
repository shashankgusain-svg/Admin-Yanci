# Migration E2E (local)

Production `api.investwithyanci.com` does not yet expose `/v1/admin/migrations/*`
(backend branch `current-user-migration`). This harness runs a local API that uses
the **real** parsers from sibling `yanci-backend` with an in-memory commit store.

## Run

```bash
# terminal 1 — API (needs ../yanci-backend on the migration branch)
node scripts/migration-e2e-server.js

# terminal 2 — admin UI proxied to that API
MIGRATION_E2E_PROXY=1 NEXT_PUBLIC_API_URL=http://localhost:3000/e2e-api/v1/ npm run dev
```

Open http://localhost:3000/login (any valid email/password against the mock login),
then `/migrations`.

## Fixtures

- Clients: `../yanci-backend/tests/fixtures/migration/ttb_clients_sample.xlsx`
- Portfolio: `scripts/fixtures/ttb_portfolio_sample.xlsx`
