import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  DEFAULT_AUTH_REDIRECT_PATH,
  LOGIN_PATH,
  PUBLIC_CENLAB_CALCULATOR_PATH,
} from "@/lib/auth-constants";

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === LOGIN_PATH ||
    pathname.startsWith("/api/auth/") ||
    pathname === PUBLIC_CENLAB_CALCULATOR_PATH
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (sessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  const nextPath = pathname === LOGIN_PATH ? DEFAULT_AUTH_REDIRECT_PATH : `${pathname}${search}`;
  loginUrl.searchParams.set("next", nextPath || DEFAULT_AUTH_REDIRECT_PATH);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
