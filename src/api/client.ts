import axios, { AxiosError } from "axios";

export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  data?: unknown;
  statusCode?: number;
  error?: unknown;
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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const payload = error.response?.data;
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Automatically log out and redirect to login if we get a 401 Unauthorized
    if (status === 401 && typeof window !== "undefined") {
      // Don't redirect if the error is from a login attempt
      const isLoginRequest = requestUrl.includes("auth/login");
      const isAlreadyOnLoginPage = window.location.pathname === "/login";

      if (!isLoginRequest && !isAlreadyOnLoginPage) {
        // Force redirect to login page (the actual path is /login based on logs)
        window.location.href = "/login?expired=true";
      }
    }
    
    // Prioritize descriptive error messages from the payload
    const message =
      (typeof payload?.error === "string" ? payload.error : undefined) ||
      getNestedErrorMessage(payload?.error) ||
      payload?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new ApiError(message, status ?? 500, payload));
  },
);
