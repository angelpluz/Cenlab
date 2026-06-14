# Water Dungeon API Access

The Water Dungeon page is available at:

```text
/water-dungeon
```

The browser calls the same-origin Vercel Function:

```text
/api/water-dungeon/*
```

The Vercel Function forwards requests to:

```text
https://api.alprasoft-corp.com/api/water-dungeon/*
```

Set the upstream base URL with:

```text
WATER_DUNGEON_UPSTREAM_API_BASE_URL=https://api.alprasoft-corp.com
```

The proxy uses the same Vercel OIDC pattern as OGCH. It exposes only these routes:

```text
GET  /api/water-dungeon/characters
POST /api/water-dungeon/complete
POST /api/water-dungeon/manual-adjust
POST /api/water-dungeon/reset-cooldown
```

Until the backend endpoints exist, the page falls back to the seeded roster and browser localStorage so the tracker remains usable during local development.
