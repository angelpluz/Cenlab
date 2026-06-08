import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_TTL_SECONDS,
} from "@/lib/auth-constants";
import { createSessionToken, isConfiguredAuth, validateCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  if (!isConfiguredAuth()) {
    return NextResponse.json(
      { error: "Authentication is not configured on the server." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!validateCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: createSessionToken(username),
    httpOnly: true,
    maxAge: AUTH_SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
