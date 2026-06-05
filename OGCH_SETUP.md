# OGCH Vercel-Only API Access

The browser only calls the same-origin Vercel Function:

```text
/api/ogch/*
```

The Vercel Function forwards requests to:

```text
https://api.alprasoft-corp.com/api/ogch/*
```

Direct browser access to the upstream OGCH API is rejected. The backend verifies a short-lived Vercel OIDC token and only accepts this identity:

```text
owner: angelpluzs-projects
project: cenlab
environment: production
```

## Required Vercel Setting

In the `cenlab` Vercel project:

1. Open `Settings`.
2. Open `Security`.
3. Enable `Secure Backend Access with OIDC federation`.
4. Use `Team` issuer mode.
5. Redeploy Production.

Vercel adds the OIDC token to Function requests as `x-vercel-oidc-token`. No persistent API secret is stored in the frontend or Vercel environment variables.

## Optional Server-Only Environment

The upstream URL can be changed without exposing it to the browser:

```text
OGCH_UPSTREAM_API_BASE_URL=https://api.alprasoft-corp.com
```

Do not use a `NEXT_PUBLIC_` variable for backend credentials or direct OGCH API access.

## Request Flow

```text
Browser
  -> cenlab.vercel.app/api/ogch/*
  -> Vercel Function with short-lived OIDC token
  -> api.alprasoft-corp.com/api/ogch/*
  -> MySQL
```

The Vercel proxy only exposes these routes:

```text
GET  /api/ogch/characters
POST /api/ogch/complete
POST /api/ogch/manual-adjust
POST /api/ogch/reset-cooldown
```

Mutations also require a same-origin browser request.
