# OGCH Frontend Setup

This Next.js app does not connect directly to the database. OGCH persistence, cooldown validation, clear counts, and run logs are handled by the backend API:

```text
https://api.alprasoft-corp.com
```

## Environment

Create `.env` from `.env.example` when a different API host is needed:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.alprasoft-corp.com
```

If `NEXT_PUBLIC_API_BASE_URL` is not set, the frontend falls back to `https://api.alprasoft-corp.com`.

## Frontend Files

- `src/app/ogch/page.tsx` - OGCH page route.
- `src/components/ogch/OgchTracker.tsx` - Main dashboard, filters, sort, modals, and API calls.
- `src/components/ogch/OgchCharacterCard.tsx` - Character card.
- `src/components/ogch/OgchProgressBar.tsx` - Progress to next OGCH level.
- `src/components/ogch/OgchCooldownBadge.tsx` - Cooldown status display.
- `src/lib/api.ts` - REST client for `api.alprasoft-corp.com`.
- `src/lib/ogch.ts` - Frontend display helpers for countdown, EXP formatting, and Bangkok time.

## Backend Endpoints Used

```text
GET  /api/ogch/characters
POST /api/ogch/complete
POST /api/ogch/manual-adjust
POST /api/ogch/reset-cooldown
```

The frontend expects these paths under `NEXT_PUBLIC_API_BASE_URL`.

## Backend Registration Required

Before the OGCH page can load data, the backend deployed at `api.alprasoft-corp.com` must register and deploy all four OGCH routes.

The backend must also allow browser requests from:

```text
https://cenlab.vercel.app
```

For local development, also allow:

```text
http://localhost:3001
http://localhost:3000
```

Required CORS behavior:

```text
Access-Control-Allow-Origin: https://cenlab.vercel.app
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

The `OPTIONS /api/ogch/characters` preflight request must return a successful response instead of `404`.

Current verification result on June 5, 2026:

```text
GET https://api.alprasoft-corp.com/api/ogch/characters -> 404 Not Found
OPTIONS https://api.alprasoft-corp.com/api/ogch/characters -> 404 Not Found
```

## Vercel Environment Variable

Use `.env.production` when importing the production variable into Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.alprasoft-corp.com
```

In Vercel, add it to Production and Preview environments, then redeploy the frontend. `.env.local` is for local Next.js development only.

## Backend Table Shape

The backend owns these tables and columns:

```text
characters
- id
- name
- job
- base_level
- created_at
- updated_at

ogch_progress
- id
- character_id
- clear_count
- last_completed_at
- next_available_at
- created_at
- updated_at

ogch_run_logs
- id
- character_id
- completed_at
- clear_count_after_run
- ogch_level_after_run
- exp_reward_after_run
- created_at
```
