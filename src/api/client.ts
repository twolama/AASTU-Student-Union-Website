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
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const payload = error.response?.data;
    
    // Prioritize descriptive error messages from the payload
    const message =
      (typeof payload?.error === "string" ? payload.error : undefined) ||
      (typeof (payload?.error as any)?.message === "string" ? (payload?.error as any).message : undefined) ||
      payload?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new ApiError(message, error.response?.status ?? 500, payload));
  },
);
