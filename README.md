# Yanci Admin Panel

Next.js admin frontend for the Yanci investing platform (Ghana). Used by internal admins for KYC, users, support, policies, revenue, and related operations.

## Requirements

- Node.js **18.17+** (20 LTS recommended)
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
| `NEXT_PUBLIC_API_URL` | No | API base URL. Defaults to `https://api.investwithyanci.com/v1/` when unset (see `src/services/api/helper.js`). |

Use `.env.local` for machine-specific values. Do not commit secrets. Auth tokens and user session data are stored in browser cookies by the app after login.

## Scripts

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint via next lint (non-interactive)
```

## Auth notes

- Login issues a Bearer token stored in cookies (`token` + `user`).
- **Remember me** extends cookie lifetime (7 days vs ~1 hour).
- Route access is gated in `src/middleware.js` and permission helpers in `src/utils/helpers.js`.
- Confirm the backend disables open `registerSuperAdmin` registration in production; the client export exists but is not wired into the UI.

## Deploy

1. Set Node 18+ on the host / CI image.
2. Configure `NEXT_PUBLIC_API_URL` if the API is not the default production host.
3. Build and run:

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
