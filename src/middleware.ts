import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/announcements",
  "/clubs",
  // "/events",  // Temporarily disabled for testing
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
      // Not a JWT, but if it exists we might want to let it through and let the API handle 401s
      return true;
    }

    // Decode base64url (replace - with +, _ with /) and add padding if necessary
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const payload = JSON.parse(atob(base64));
    const exp = typeof payload?.exp === "number" ? payload.exp : null;

    if (!exp) {
      // No expiration in token, but token exists
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    // Add a small buffer (30 seconds) to prevent edge cases
    return exp > nowInSeconds - 30;
  } catch (error) {
    // If we can't parse it but it exists, it might be an opaque token or weirdly formatted JWT.
    // We'll return true and let the downstream API requests handle the actual authorization.
    // This prevents redirection loops if the JWT format is slightly off.
    console.warn("[Middleware] Failed to parse access token, but it exists. Allowing request.", error);
    return true;
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
