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
