import type { NextRequest } from "next/server";

const UPSTREAM_API_BASE_URL =
  process.env.OGCH_UPSTREAM_API_BASE_URL?.replace(/\/$/, "") ??
  "https://api.alprasoft-corp.com";

const ALLOWED_ROUTES = new Set([
  "GET:characters",
  "GET:state",
  "POST:mapping",
  "POST:import-local",
  "POST:complete",
  "POST:manual-adjust",
  "POST:reset-cooldown",
]);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(status: number, message: string) {
  return Response.json({ success: false, message }, { status });
}

function isSameOriginMutation(request: NextRequest) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === request.nextUrl.origin);
}

function getUpstreamHeaders(request: NextRequest, oidcToken: string) {
  return {
    Authorization: `Bearer ${oidcToken}`,
    "Content-Type": "application/json",
    "X-Request-Id": request.headers.get("x-vercel-id") ?? crypto.randomUUID(),
  };
}

function getProxyHeaders(contentType = "application/json") {
  return {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
    "X-OGCH-Proxy": "vercel-oidc",
  };
}

async function proxyOgchRequest(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const path = context.params.path.join("/");
  const routeKey = `${request.method}:${path}`;

  if (!ALLOWED_ROUTES.has(routeKey)) {
    return jsonError(404, "OGCH route not found");
  }

  if (request.method !== "GET" && !isSameOriginMutation(request)) {
    return jsonError(403, "Cross-origin OGCH mutations are not allowed");
  }

  const oidcToken = request.headers.get("x-vercel-oidc-token");

  if (!oidcToken) {
    return jsonError(503, "Vercel OIDC is not enabled for this deployment");
  }

  const requestBody = request.method === "GET" ? undefined : await request.text();

  const upstreamResponse = await fetch(`${UPSTREAM_API_BASE_URL}/api/ogch/${path}`, {
    body: requestBody,
    cache: "no-store",
    headers: getUpstreamHeaders(request, oidcToken),
    method: request.method,
  });

  return new Response(upstreamResponse.body, {
    headers: getProxyHeaders(upstreamResponse.headers.get("content-type") ?? "application/json"),
    status: upstreamResponse.status,
  });
}

export function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return proxyOgchRequest(request, context);
}

export function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return proxyOgchRequest(request, context);
}
