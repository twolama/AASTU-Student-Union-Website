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
const LOGOUT_PATH = "/api/v1/auth/logout";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function normalizeBaseUrl(rawBaseUrl: string | undefined): string {
  if (!rawBaseUrl) {
    throw new Error("API_BASE_URL is not configured. Set API_BASE_URL in frontend .env.local, for example: http://localhost:8000");
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
  if (Number.isNaN(expiresEpoch)) {
    return undefined;
  }

  const seconds = Math.floor((expiresEpoch - Date.now()) / 1000);
  return seconds > 0 ? seconds : undefined;
}

function buildProxyUrl(baseUrl: string, pathSegments: string[], requestUrl: URL) {
  const encodedPath = pathSegments.map((segment) => encodeURIComponent(segment)).join("/");
  
  // Django REST Framework generally requires a trailing slash for non-file resources.
  // We ensure it exists if the original request ends with a slash OR if it's an API resource without an extension.
  const lastSegment = pathSegments[pathSegments.length - 1] || "";
  const isFile = lastSegment.includes(".");
  const isApiRequest = pathSegments[0] === "api";
  
  const shouldHaveSlash = requestUrl.pathname.endsWith("/") || (isApiRequest && !isFile);
  const normalizedPath = shouldHaveSlash ? `${encodedPath}/` : encodedPath;
  
  // Use searchParams to ensure query parameters are correctly extracted
  const query = requestUrl.search || "";
  
  return `${baseUrl}/${normalizedPath}${query}`;
}

async function normalizeErrorResponse(upstreamResponse: Response) {
  const fallbackMessage = "Request failed";
  let message = fallbackMessage;
  let upstreamError: unknown = null;

  const contentType = upstreamResponse.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const payload = await upstreamResponse.json();
      upstreamError = payload;
      if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
        message = payload.message;
      } else if (payload?.error) {
        message = typeof payload.error === "string" ? payload.error : JSON.stringify(payload.error);
      } else if (typeof payload === "object") {
        // Fallback for DRF field-level errors: {"field": ["error"]}
        message = "Validation Error: " + JSON.stringify(payload);
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
    { status: upstreamResponse.status },
  );
}

async function handleLoginResponse(upstreamResponse: Response) {
  const payload = await upstreamResponse.json();

  const accessToken = payload?.data?.tokens?.accessToken;
  const refreshToken = payload?.data?.tokens?.refreshToken;

  if (typeof accessToken?.token !== "string" || typeof refreshToken?.token !== "string") {
    return NextResponse.json(
      {
        success: false,
        message: "Login response is missing token information",
        data: null,
        statusCode: 502,
        error: {
          code: "INVALID_LOGIN_RESPONSE",
        },
      },
      { status: 502 },
    );
  }

  const response = NextResponse.json(
    {
      success: payload.success,
      message: payload.message,
      statusCode: payload.statusCode,
      error: payload.error,
      data: {
        user: payload?.data?.user ?? null,
      },
    },
    { status: upstreamResponse.status },
  );

  response.cookies.set({
    name: "access_token",
    value: accessToken.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getLoginCookieMaxAge(accessToken.expires),
  });

  response.cookies.set({
    name: "refresh_token",
    value: refreshToken.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getLoginCookieMaxAge(refreshToken.expires),
  });

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
    { status: 200 },
  );

  response.cookies.set({
    name: "access_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: "refresh_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const startedAt = Date.now();
  const method = request.method.toUpperCase();
  const { path } = await context.params;
  const proxiedPath = `/${path.join("/")}`;

  // Frontend-managed logout: clear auth cookies without calling backend.
  if (method === "POST" && proxiedPath === LOGOUT_PATH) {
    const durationMs = Date.now() - startedAt;

    return handleLogoutResponse();
  }

  try {
    const baseUrl = normalizeBaseUrl(process.env.API_BASE_URL);

    const targetUrl = buildProxyUrl(baseUrl, path, request.nextUrl);

    const headers = sanitizeHeaders(request.headers, FORWARDED_HEADER_BLOCKLIST);
    // Preserve the incoming Accept header when present (important for binary/file responses).
    if (!headers.has("accept")) {
      headers.set("accept", "application/json");
    }

    const accessTokenCookie = request.cookies.get("access_token")?.value;
    if (accessTokenCookie && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${accessTokenCookie}`);
    }

    const hasBody = !["GET", "HEAD"].includes(method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "follow",
    });

    const durationMs = Date.now() - startedAt;


    if (!upstreamResponse.ok) {
      const err = await normalizeErrorResponse(upstreamResponse);
      try {
        err.headers.set("x-proxy-target", targetUrl);
      } catch (e) {
        // ignore header set errors in older runtimes
      }
      return err;
    }

    if (method === "POST" && proxiedPath === LOGIN_PATH) {
      return await handleLoginResponse(upstreamResponse);
    }

    const responseHeaders = sanitizeHeaders(upstreamResponse.headers, RESPONSE_HEADER_BLOCKLIST);
    try {
      responseHeaders.set("x-proxy-target", targetUrl);
    } catch (e) {
      /* ignore */
    }

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;


    return NextResponse.json(
      {
        success: false,
        message: "Proxy request failed",
        data: null,
        statusCode: 500,
        error: {
          code: "PROXY_INTERNAL_ERROR",
        },
      },
      { status: 500 },
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
