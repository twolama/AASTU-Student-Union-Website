import axios, { AxiosError } from "axios";

export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  data?: unknown;
  statusCode?: number;
  error?: unknown;
  [key: string]: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  payload?: ApiErrorPayload;

  constructor(message: string, statusCode: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

export const apiClient = axios.create({
  baseURL: "/api/proxy",
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

function getNestedErrorMessage(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const message = (value as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
}

function getErrorCode(payload?: ApiErrorPayload): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const errorValue = payload.error;
  if (typeof errorValue === "object" && errorValue !== null) {
    const code = (errorValue as { code?: unknown }).code;
    if (typeof code === "string" && code.trim().length > 0) {
      return code;
    }
  }

  return undefined;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const payload = error.response?.data;
    const status = error.response?.status;
    const errorCode = getErrorCode(payload);
    const requestUrl = error.config?.url || "";

    // Automatically log out and redirect to login if we get a 401 Unauthorized
    if (status === 401 && typeof window !== "undefined") {
      const requestUrlLower = requestUrl.toLowerCase();
      // Don't redirect if the error is from a login attempt or a "me" check (used on public pages)
      const isLoginRequest = requestUrlLower.includes("auth/login");
      const isAuthCheck = requestUrlLower.includes("users/me");
      const isAlreadyOnLoginPage = window.location.pathname === "/login";

      if (!isLoginRequest && !isAuthCheck && !isAlreadyOnLoginPage) {
        // Force redirect to login page
        window.location.href = "/login?expired=true";
      }
    }
    
    const backendUnavailableMessage =
      "The backend service is unavailable right now. Please try again shortly.";

    const message =
      (status === 503 && errorCode === "BACKEND_UNAVAILABLE"
        ? backendUnavailableMessage
        : undefined) ||
      (typeof payload?.error === "string" ? payload.error : undefined) ||
      getNestedErrorMessage(payload?.error) ||
      payload?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new ApiError(message, status ?? 500, payload));
  },
);
