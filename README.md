# Yanci Admin Panel

Next.js admin frontend for the Yanci investing platform (Ghana). Used by internal admins for KYC, users, support, policies, revenue, and related operations.

## Requirements

- Node.js **24.x** (required on Vercel; 22+ locally is fine for most work)
- npm 9+

## Setup

```bash
npm install
```

Copy env defaults if you need a local override (optional — production API is the default):

```bash
cp .env.example .env.local
```

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `API_URL` | No | Upstream API base URL used by the server proxy. Defaults to `https://api.investwithyanci.com/v1/`. |
| `NEXT_PUBLIC_API_URL` | No | Same fallback as `API_URL` when `API_URL` is unset. |
| `SESSION_SECRET` | Yes in production | Secret used to sign the user cookie. At least 32 characters. |

Use `.env.local` for machine-specific values. Do not commit secrets. Login sets the API token in an HttpOnly cookie. The browser keeps a signed copy of the admin profile for the sidebar. Route checks accept that profile only when the signature matches `SESSION_SECRET`.

## Scripts

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint via next lint (non-interactive)
```

## Auth notes

- Login goes through `/api/auth/login`. The API token is an HttpOnly cookie. The `user` cookie is a signed profile the sidebar can read.
- **Remember me** extends cookie lifetime (7 days vs 1 hour).
- `src/middleware.js` accepts the profile only when its signature matches `SESSION_SECRET`. Rewriting `roleType` in the browser fails that check.
- Confirm the backend disables open `admin/super-admin/register` in production. The admin client no longer calls it.
- Terms and privacy are publicly readable. `policy/getpolicy` does not require an admin token. Updates do.

## Deploy

1. Set Node **24.x** on the host / CI image (Vercel Project Settings → Node.js Version, or `engines.node` in `package.json`).
2. Set `SESSION_SECRET` to a random string of at least 32 characters.
3. Configure `API_URL` if the API is not the default production host.
4. Build and run:

```bash
npm ci
npm run build
npm run start
```

Any Node host that can run Next.js 14 (Vercel, Docker, VM, etc.) works. Ensure the deployment origin is allowed by your API CORS policy and that HTTPS is used in production (cookies set `secure` when `NODE_ENV=production`).

## Project layout

- `src/pages` — routes (Pages Router)
- `src/components` — shared UI (table, sidebar, modals, …)
- `src/services/api` — HTTP clients and cookie helpers
- `src/middleware.js` — auth / permission gate
