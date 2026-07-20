import type { NextRequest } from "next/server";
import { addOgchCooldown } from "@/lib/ogch";
import type { OgchCharacterProgress, OgchMutationApiResponse } from "@/lib/ogch-types";

const UPSTREAM_API_BASE_URL =
  process.env.OGCH_UPSTREAM_API_BASE_URL?.replace(/\/$/, "") ??
  "https://api.alprasoft-corp.com";

const ALLOWED_ROUTES = new Set([
  "GET:characters",
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

function getMutationCharacter(payload: OgchMutationApiResponse): OgchCharacterProgress | undefined {
  return payload.data ?? payload.character;
}

async function alignCompletedCharacterReset(
  request: NextRequest,
  oidcToken: string,
  completeResponse: Response
): Promise<Response> {
  const responseText = await completeResponse.text();
  let completePayload: OgchMutationApiResponse;

  try {
    completePayload = JSON.parse(responseText) as OgchMutationApiResponse;
  } catch {
    return new Response(responseText, {
      headers: getProxyHeaders(completeResponse.headers.get("content-type") ?? "application/json"),
      status: completeResponse.status,
    });
  }

  const completedCharacter = getMutationCharacter(completePayload);
  if (
    !completeResponse.ok ||
    !completedCharacter ||
    !completedCharacter.lastCompletedAt ||
    !Number.isFinite(completedCharacter.clearCount)
  ) {
    return Response.json(completePayload, {
      headers: getProxyHeaders(),
      status: completeResponse.status,
    });
  }

  let alignedNextAvailableAt: string;

  try {
    alignedNextAvailableAt = addOgchCooldown(
      new Date(completedCharacter.lastCompletedAt)
    ).toISOString();
  } catch {
    return Response.json(completePayload, {
      headers: getProxyHeaders(),
      status: completeResponse.status,
    });
  }

  const adjustResponse = await fetch(`${UPSTREAM_API_BASE_URL}/api/ogch/manual-adjust`, {
    body: JSON.stringify({
      characterId: completedCharacter.id,
      clearCount: completedCharacter.clearCount,
      lastCompletedAt: completedCharacter.lastCompletedAt,
      nextAvailableAt: alignedNextAvailableAt,
    }),
    cache: "no-store",
    headers: getUpstreamHeaders(request, oidcToken),
    method: "POST",
  });

  if (!adjustResponse.ok) {
    return Response.json(completePayload, {
      headers: getProxyHeaders(),
      status: completeResponse.status,
    });
  }

  const adjustPayload = (await adjustResponse.json().catch(() => null)) as OgchMutationApiResponse | null;
  const adjustedCharacter = adjustPayload ? getMutationCharacter(adjustPayload) : undefined;
  if (adjustedCharacter) {
    if (completePayload.data) completePayload.data = adjustedCharacter;
    if (completePayload.character) completePayload.character = adjustedCharacter;
  }

  return Response.json(completePayload, {
    headers: getProxyHeaders(),
    status: completeResponse.status,
  });
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

  if (request.method === "POST" && path === "complete") {
    return alignCompletedCharacterReset(request, oidcToken, upstreamResponse);
  }

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
