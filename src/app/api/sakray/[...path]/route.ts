import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { verifySessionToken } from "@/lib/auth";

const UPSTREAM_API_BASE_URL =
  process.env.SAKRAY_UPSTREAM_API_BASE_URL?.replace(/\/$/, "") ??
  process.env.OGCH_UPSTREAM_API_BASE_URL?.replace(/\/$/, "") ??
  "https://api.alprasoft-corp.com";

const ALLOWED_ROUTES = new Set([
  "GET:state",
  "POST:mapping",
  "POST:complete",
  "POST:manual-adjust",
  "POST:reset-cooldown",
]);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(status: number, message: string) {
  return Response.json(
    { success: false, message },
    { headers: { "Cache-Control": "no-store" }, status }
  );
}

function isSameOriginMutation(request: NextRequest) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === request.nextUrl.origin);
}

async function proxySakrayRequest(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const path = context.params.path.join("/");
  const routeKey = `${request.method}:${path}`;

  if (!ALLOWED_ROUTES.has(routeKey)) {
    return jsonError(404, "Sakray route not found");
  }

  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!verifySessionToken(sessionToken)) {
    return jsonError(401, "Authentication required");
  }

  if (request.method !== "GET" && !isSameOriginMutation(request)) {
    return jsonError(403, "Cross-origin Sakray mutations are not allowed");
  }

  const oidcToken = request.headers.get("x-vercel-oidc-token");
  if (!oidcToken) {
    return jsonError(503, "Vercel OIDC is not enabled for this deployment");
  }

  const upstreamResponse = await fetch(`${UPSTREAM_API_BASE_URL}/api/sakray/${path}`, {
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${oidcToken}`,
      "Content-Type": "application/json",
      "X-Request-Id": request.headers.get("x-vercel-id") ?? crypto.randomUUID(),
    },
    method: request.method,
  });

  return new Response(upstreamResponse.body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": upstreamResponse.headers.get("content-type") ?? "application/json",
      "X-Sakray-Proxy": "vercel-oidc",
    },
    status: upstreamResponse.status,
  });
}

export function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return proxySakrayRequest(request, context);
}

export function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return proxySakrayRequest(request, context);
}
