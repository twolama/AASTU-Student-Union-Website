import { NextRequest, NextResponse } from "next/server";

const FORWARDED_HEADER_BLOCKLIST = new Set([
  "host",
  "connection",
  "content-encoding",
  "content-length",
]);

const RESPONSE_HEADER_BLOCKLIST = new Set([
  "content-encoding",
  "content-length",
]);

const LOGIN_PATH = "/api/v1/auth/login";
const REFRESH_PATH = "/api/v1/auth/refresh";
const LOGOUT_PATH = "/api/v1/auth/logout";
const CHANGE_PASSWORD_PATH = "/api/v1/auth/change-password";

const UPSTREAM_UNAVAILABLE_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
]);

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function extractErrorCode(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const directCode = (value as { code?: unknown }).code;
  if (typeof directCode === "string" && directCode.trim()) {
    return directCode;
  }

  const nestedCause = (value as { cause?: unknown }).cause;
  if (nestedCause) {
    const nestedCode = extractErrorCode(nestedCause);
    if (nestedCode) {
      return nestedCode;
    }

    if (nestedCause instanceof AggregateError) {
      for (const inner of nestedCause.errors) {
        const innerCode = extractErrorCode(inner);
        if (innerCode) {
          return innerCode;
        }
      }
    }
  }

  return undefined;
}

function normalizeBaseUrl(rawBaseUrl: string | undefined): string {
  if (!rawBaseUrl) {
    throw new Error(
      "API_BASE_URL is not configured. Set API_BASE_URL in frontend .env.local, for example: http://localhost:8000"
    );
  }
  return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
}

function shouldDropHeader(name: string, blocklist: Set<string>) {
  const lower = name.toLowerCase();
  return blocklist.has(lower) || lower.startsWith("access-control-");
}

function sanitizeHeaders(input: Headers, blocklist: Set<string>) {
  const headers = new Headers();
  input.forEach((value, key) => {
    if (!shouldDropHeader(key, blocklist)) {
      headers.set(key, value);
    }
  });
  return headers;
}

function getLoginCookieMaxAge(expiresAt: string) {
  const expiresEpoch = Date.parse(expiresAt);
  if (Number.isNaN(expiresEpoch)) return undefined;
  const seconds = Math.floor((expiresEpoch - Date.now()) / 1000);
  return seconds > 0 ? seconds : undefined;
}

function getJwtCookieMaxAge(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return undefined;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const payload = JSON.parse(atob(base64));
    const exp = typeof payload?.exp === "number" ? payload.exp : null;
    if (!exp) return undefined;

    const seconds = exp - Math.floor(Date.now() / 1000);
    return seconds > 0 ? seconds : undefined;
  } catch {
    return undefined;
  }
}

function buildProxyUrl(
  baseUrl: string,
  pathSegments: string[],
  requestUrl: URL
): string {
  // FIX: Do NOT re-encode path segments — they come from Next.js already decoded.
  // Re-encoding breaks UUIDs, slashes, and any special characters in the path.
  // Instead, join them as-is and let the URL constructor handle validation.
  const joinedPath = pathSegments.join("/");

  const lastSegment = pathSegments[pathSegments.length - 1] ?? "";
  const isFile = lastSegment.includes(".");
  const isApiRequest = pathSegments[0] === "api";

  const shouldHaveSlash =
    requestUrl.pathname.endsWith("/") || (isApiRequest && !isFile);

  const normalizedPath = shouldHaveSlash
    ? `${joinedPath}/`
    : joinedPath;

  const query = requestUrl.search ?? "";

  return `${baseUrl}/${normalizedPath}${query}`;
}

async function normalizeErrorResponse(upstreamResponse: Response) {
  const fallbackMessage = "Request failed";
  let message = fallbackMessage;
  let upstreamError: unknown = null;

  function extractValidationMessage(details: unknown): string | undefined {
    if (typeof details !== "object" || details === null) return undefined;

    for (const value of Object.values(details as Record<string, unknown>)) {
      if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (typeof first === "string" && first.trim()) return first;
      }

      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    return undefined;
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const payload = await upstreamResponse.json();
      upstreamError = payload;
      const errorPayload = payload?.error;

      if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
        message = payload.message;
      } else if (typeof errorPayload === "string" && errorPayload.trim().length > 0) {
        message = errorPayload;
      } else if (errorPayload && typeof errorPayload === "object") {
        const nestedMessage =
          typeof (errorPayload as { message?: unknown }).message === "string"
            ? String((errorPayload as { message?: unknown }).message)
            : extractValidationMessage((errorPayload as { details?: unknown }).details) ||
              extractValidationMessage(errorPayload);

        message = nestedMessage || "Validation error";
      } else if (typeof payload === "object") {
        message = extractValidationMessage(payload) || "Validation error";
      }
    } catch {
      message = fallbackMessage;
    }
  } else {
    try {
      const textPayload = await upstreamResponse.text();
      if (textPayload && textPayload.trim().length > 0) {
        const trimmed = textPayload.trim();
        upstreamError = trimmed.slice(0, 4000);
        message = `Upstream ${upstreamResponse.status} error`;
      }
    } catch {
      message = fallbackMessage;
    }
  }

  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
      statusCode: upstreamResponse.status,
      error: {
        code: "UPSTREAM_REQUEST_FAILED",
        upstream: upstreamError,
      },
    },
    { status: upstreamResponse.status }
  );
}

async function handleLoginResponse(upstreamResponse: Response) {
  const payload = await upstreamResponse.json();

  const accessToken = payload?.data?.tokens?.accessToken;
  const refreshToken = payload?.data?.tokens?.refreshToken;

  if (
    typeof accessToken?.token !== "string" ||
    typeof refreshToken?.token !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Login response is missing token information",
        data: null,
        statusCode: 502,
        error: { code: "INVALID_LOGIN_RESPONSE" },
      },
      { status: 502 }
    );
  }

  const response = NextResponse.json(
    {
      success: payload.success,
      message: payload.message,
      statusCode: payload.statusCode,
      error: payload.error,
      data: { user: payload?.data?.user ?? null },
    },
    { status: upstreamResponse.status }
  );

  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: "access_token",
    value: accessToken.token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: getLoginCookieMaxAge(accessToken.expires),
  });

  response.cookies.set({
    name: "refresh_token",
    value: refreshToken.token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: getLoginCookieMaxAge(refreshToken.expires),
  });

  if (payload?.data?.user?.mustChangePassword) {
    response.cookies.set({
      name: "must_change_password",
      value: "1",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: getLoginCookieMaxAge(refreshToken.expires),
    });
  } else {
    response.cookies.set({
      name: "must_change_password",
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}

function handleLogoutResponse() {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logout successful",
      data: null,
      statusCode: 200,
      error: null,
    },
    { status: 200 }
  );

  const isProd = process.env.NODE_ENV === "production";
  const clearCookie = (name: string) =>
    response.cookies.set({
      name,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

  clearCookie("access_token");
  clearCookie("refresh_token");
  clearCookie("must_change_password");

  return response;
}

function clearAuthCookies(response: NextResponse) {
  const isProd = process.env.NODE_ENV === "production";
  const clearCookie = (name: string) =>
    response.cookies.set({
      name,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

  clearCookie("access_token");
  clearCookie("refresh_token");
  clearCookie("must_change_password");

  return response;
}

async function refreshAccessToken(baseUrl: string, request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${baseUrl}${REFRESH_PATH}/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  const accessToken =
    typeof payload?.access === "string"
      ? payload.access
      : typeof payload?.data?.accessToken?.token === "string"
        ? payload.data.accessToken.token
        : null;

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken:
      typeof payload?.refresh === "string"
        ? payload.refresh
        : typeof payload?.data?.refreshToken?.token === "string"
          ? payload.data.refreshToken.token
          : null,
  };
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const method = request.method.toUpperCase();
  const { path } = await context.params;
  const proxiedPath = `/${path.join("/")}`;

  // Frontend-managed logout: clear auth cookies without calling backend.
  if (method === "POST" && proxiedPath === LOGOUT_PATH) {
    return handleLogoutResponse();
  }

  // FIX: Validate API_BASE_URL early and return a clear 500 instead of throwing.
  let baseUrl: string;
  try {
    baseUrl = normalizeBaseUrl(process.env.API_BASE_URL);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "API_BASE_URL misconfigured";
    console.error("[proxy] Configuration error:", message);
    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
        statusCode: 500,
        error: { code: "PROXY_CONFIGURATION_ERROR" },
      },
      { status: 500 }
    );
  }

  let targetUrl: string;
  try {
    targetUrl = buildProxyUrl(baseUrl, path, request.nextUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to build proxy URL";
    console.error("[proxy] URL build error:", message);
    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
        statusCode: 500,
        error: { code: "PROXY_URL_BUILD_ERROR" },
      },
      { status: 500 }
    );
  }

  try {
    const headers = sanitizeHeaders(request.headers, FORWARDED_HEADER_BLOCKLIST);

    if (!headers.has("accept")) {
      headers.set("accept", "application/json");
    }

    const accessTokenCookie = request.cookies.get("access_token")?.value;
    if (accessTokenCookie && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${accessTokenCookie}`);
    }

    const hasBody = !["GET", "HEAD"].includes(method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    let upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "follow",
    });

    const shouldTryRefresh =
      upstreamResponse.status === 401 &&
      proxiedPath !== LOGIN_PATH &&
      proxiedPath !== REFRESH_PATH &&
      proxiedPath !== LOGOUT_PATH &&
      proxiedPath !== CHANGE_PASSWORD_PATH;

    if (shouldTryRefresh) {
      const refreshed = await refreshAccessToken(baseUrl, request);

      if (refreshed?.accessToken) {
        headers.set("authorization", `Bearer ${refreshed.accessToken}`);
        upstreamResponse = await fetch(targetUrl, {
          method,
          headers,
          body,
          cache: "no-store",
          redirect: "follow",
        });

        if (upstreamResponse.ok) {
          const responseHeaders = sanitizeHeaders(
            upstreamResponse.headers,
            RESPONSE_HEADER_BLOCKLIST
          );
          try {
            responseHeaders.set("x-proxy-target", targetUrl);
          } catch {
            /* ignore */
          }

          const response = new NextResponse(upstreamResponse.body, {
            status: upstreamResponse.status,
            statusText: upstreamResponse.statusText,
            headers: responseHeaders,
          });

          const isProd = process.env.NODE_ENV === "production";
          response.cookies.set({
            name: "access_token",
            value: refreshed.accessToken,
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: getJwtCookieMaxAge(refreshed.accessToken),
          });

          if (refreshed.refreshToken) {
            response.cookies.set({
              name: "refresh_token",
              value: refreshed.refreshToken,
              httpOnly: true,
              secure: isProd,
              sameSite: "lax",
              path: "/",
              maxAge: getJwtCookieMaxAge(refreshed.refreshToken),
            });
          }

          return response;
        }
      }

      const response = NextResponse.json(
        {
          success: false,
          message: "Your session has expired. Please sign in again.",
          data: null,
          statusCode: 401,
          error: { code: "AUTH_SESSION_EXPIRED" },
        },
        { status: 401 }
      );

      try {
        response.headers.set("x-proxy-target", targetUrl);
      } catch {
        /* ignore */
      }

      return clearAuthCookies(response);
    }

    if (!upstreamResponse.ok) {
      const err = await normalizeErrorResponse(upstreamResponse);
      try {
        err.headers.set("x-proxy-target", targetUrl);
      } catch {
        // ignore
      }
      return err;
    }

    if (method === "POST" && proxiedPath === LOGIN_PATH) {
      return await handleLoginResponse(upstreamResponse);
    }

    if (method === "POST" && proxiedPath === CHANGE_PASSWORD_PATH) {
      const payload = await upstreamResponse.json();
      const response = NextResponse.json(payload, {
        status: upstreamResponse.status,
      });
      response.cookies.set({
        name: "must_change_password",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      try {
        response.headers.set("x-proxy-target", targetUrl);
      } catch {
        /* ignore */
      }
      return response;
    }

    const responseHeaders = sanitizeHeaders(
      upstreamResponse.headers,
      RESPONSE_HEADER_BLOCKLIST
    );
    try {
      responseHeaders.set("x-proxy-target", targetUrl);
    } catch {
      /* ignore */
    }

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    // FIX: Log the actual error so it's visible in server logs.
    console.error("[proxy] Upstream fetch failed →", targetUrl, error);

    const errorCode = extractErrorCode(error);
    const isBackendUnavailable =
      typeof errorCode === "string" &&
      UPSTREAM_UNAVAILABLE_ERROR_CODES.has(errorCode);

    const statusCode = isBackendUnavailable ? 503 : 500;
    const message = isBackendUnavailable
      ? "Backend service is currently unavailable. Please try again shortly."
      : process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Proxy request failed";

    const upstreamError =
      process.env.NODE_ENV !== "production"
        ? {
            code: errorCode,
            message: error instanceof Error ? error.message : String(error),
          }
        : null;

    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
        statusCode,
        error: {
          code: isBackendUnavailable ? "BACKEND_UNAVAILABLE" : "PROXY_INTERNAL_ERROR",
          ...(upstreamError ? { upstream: upstreamError } : {}),
        },
      },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
export async function OPTIONS(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}