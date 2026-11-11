# Two-dungeon daily tracker

Route: `/two-dungeons`. The page is named **สองดัน** and records completion of **Lasgand + Sakray** as one run. Windhawk and Cardinal have separate roster tabs, search, availability filters, run counts, manual corrections, and cooldown resets.

## Roster and persistence

The backend reads the canonical OGCH `characters` roster for `windhawk` and `bishop`, excluding the same CandySeller entry as OGCH. The Cardinal tab uses the existing Bishop/Cardinal roster. Character identities are shared; progress, party mappings and run logs are stored separately in:

- `two_dungeon_progress`
- `two_dungeon_party_mappings`
- `two_dungeon_run_logs`

Each Windhawk can map one Cardinal. Each Cardinal belongs to one two-dungeon party at a time. Completing from either member stamps both members in one transaction. Both must be available. A character without a mapping can complete individually. Reassigning a Cardinal moves its two-dungeon mapping only.

Party selection is independent from OGCH: sharing character identities does not copy or synchronize party membership. A Windhawk can run OGCH with one Cardinal and the two dungeons with another. Both roster tabs can select, change or remove the two-dungeon partner. Removing a mapping from the Cardinal tab resolves only the partner recorded in `two_dungeon_party_mappings`.

## Daily reset

Completion is recorded after both dungeons are finished. The cooldown ends at the next **04:00 Asia/Bangkok** boundary:

- Completion at 19:00: ready at 04:00 the following calendar day.
- Completion at 01:00: ready at 04:00 that morning.
- Completion exactly at 04:00: ready at 04:00 the following day.

The backend uses its database time. The frontend previews the reset using the existing Bangkok game-day helper. The server rejects attempts to complete a party while either member remains on cooldown.

## API and backend startup

The browser uses `/api/two-dungeons/{state,mapping,complete,manual-adjust,reset-cooldown}` through the existing session-authenticated, same-origin Vercel OIDC proxy. The upstream URL defaults to the OGCH upstream, with optional `TWO_DUNGEONS_UPSTREAM_API_BASE_URL` override.

Backend code in `C:\databaseauth\server`:

- `routes/two-dungeons.js`: state and transactional mutations.
- `two-dungeons-schema.js`: additive schema initialization and zero-count seed rows.
- `app.js`: registers `/api/two-dungeons` with the existing OIDC middleware.
- `schema.js`: calls the new initializer after the canonical roster is ready.
- `__tests__/two-dungeons.test.js`: reset, pair completion, isolation and validation checks.

Restart or deploy the backend with these files before using the deployed frontend. The usual backend startup creates the three new tables without copying or resetting existing OGCH/Sakray progress. The frontend requires Vercel OIDC in the same way as the existing trackers; a plain local Next.js server cannot call the production API without it.

Production rollout on November 11, 2026: created the three two-dungeon tables and restarted the backend serving port 4272. Verified the authenticated Vercel `/api/two-dungeons/state` endpoint returned HTTP 200 with 12 Windhawk-side and 12 Cardinal-side characters and no inherited party mappings. The original failure was HTTP 404 from the previous backend process, which had not loaded the new route.

## Checks

```text
npm run check:two-dungeons
npm run build
```

From `C:\databaseauth\server`:

```text
node node_modules/jest/bin/jest.js --runInBand --no-cache __tests__/two-dungeons.test.js __tests__/sakray-routes.test.js __tests__/sakray-utils.test.js __tests__/ogch-party.test.js
```
