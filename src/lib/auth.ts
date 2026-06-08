import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_TTL_SECONDS,
  DEFAULT_AUTH_REDIRECT_PATH,
  LOGIN_PATH,
} from "@/lib/auth-constants";

type AuthSession = {
  username: string;
  expiresAt: number;
};

type AuthConfig = {
  username: string;
  password: string;
  secret: string;
};

function getAuthConfig(): AuthConfig {
  const username = process.env.APP_LOGIN_USERNAME;
  const password = process.env.APP_LOGIN_PASSWORD;
  const secret = process.env.APP_SESSION_SECRET;

  if (!username || !password || !secret) {
    throw new Error(
      "Missing APP_LOGIN_USERNAME, APP_LOGIN_PASSWORD, or APP_SESSION_SECRET environment variables."
    );
  }

  return { username, password, secret };
}

function signValue(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function getSafeRedirectPath(pathname?: string | null): string {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  if (pathname === LOGIN_PATH) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  return pathname;
}

export function isConfiguredAuth(): boolean {
  return Boolean(
    process.env.APP_LOGIN_USERNAME && process.env.APP_LOGIN_PASSWORD && process.env.APP_SESSION_SECRET
  );
}

export function validateCredentials(username: string, password: string): boolean {
  const auth = getAuthConfig();
  return username === auth.username && password === auth.password;
}

export function createSessionToken(username: string): string {
  const auth = getAuthConfig();
  const expiresAt = Date.now() + AUTH_SESSION_TTL_SECONDS * 1000;
  const payload = `${username}:${expiresAt}`;
  const signature = signValue(payload, auth.secret);
  return Buffer.from(`${payload}:${signature}`, "utf8").toString("base64url");
}

export function verifySessionToken(token?: string | null): AuthSession | null {
  if (!token) return null;

  let decoded = "";

  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const [username, expiresAtRaw, signature] = decoded.split(":");
  const expiresAt = Number(expiresAtRaw);

  if (!username || !signature || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return null;
  }

  let auth: AuthConfig;

  try {
    auth = getAuthConfig();
  } catch {
    return null;
  }

  if (username !== auth.username) {
    return null;
  }

  const payload = `${username}:${expiresAt}`;
  const expected = signValue(payload, auth.secret);
  const receivedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return null;
  }

  return { username, expiresAt };
}

export function getSessionFromCookies(): AuthSession | null {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function requireAuthenticatedSession(): AuthSession {
  const session = getSessionFromCookies();

  if (!session) {
    redirect(LOGIN_PATH);
  }

  return session;
}
