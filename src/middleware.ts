import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/announcements",
  "/clubs",
  "/events",
  "/venues",
  "/bookings",
  "/users",
  "/roles",
  "/stats",
  "/settings",
  "/sign-out",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAccessTokenUsable(token: string | undefined) {
  if (!token) {
    return false;
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    const exp = typeof payload?.exp === "number" ? payload.exp : null;

    if (!exp) {
      return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return exp > nowInSeconds;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  if (isAccessTokenUsable(accessToken)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const returnTo = `${pathname}${search}`;
  loginUrl.searchParams.set("next", returnTo);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
