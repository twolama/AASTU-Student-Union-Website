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
    
    // Prioritize descriptive error messages from the payload
    const message =
      (typeof payload?.error === "string" ? payload.error : undefined) ||
      getNestedErrorMessage(payload?.error) ||
      payload?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new ApiError(message, error.response?.status ?? 500, payload));
  },
);
