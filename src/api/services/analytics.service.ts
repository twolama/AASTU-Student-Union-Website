import { apiClient, ApiError } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

const ANALYTICS_CACHE_TTL_MS = 5 * 60 * 1000;

type AnalyticsDashboardResponse = {
  success?: boolean;
  data?: unknown;
  statusCode?: number;
  forbidden?: boolean;
  message?: string;
};

type AnalyticsCacheEntry = {
  expiresAt: number;
  payload: AnalyticsDashboardResponse;
};

const analyticsCache = new Map<string, AnalyticsCacheEntry>();
const inFlightRequests = new Map<string, Promise<AnalyticsDashboardResponse>>();

export async function getAnalyticsDashboard(period = "last-8-months") {
  const cacheKey = period;
  const cached = analyticsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const request = (async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CORE.ANALYTICS.DASHBOARD, {
        params: { period },
      });
      const payload = response.data as AnalyticsDashboardResponse;
      analyticsCache.set(cacheKey, {
        payload,
        expiresAt: Date.now() + ANALYTICS_CACHE_TTL_MS,
      });
      return payload;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 403) {
        const forbiddenPayload: AnalyticsDashboardResponse = {
          success: false,
          data: null,
          statusCode: 403,
          forbidden: true,
          message: "You do not have permission to view analytics.",
        };
        analyticsCache.set(cacheKey, {
          payload: forbiddenPayload,
          expiresAt: Date.now() + 60 * 1000,
        });
        return {
          ...forbiddenPayload,
        };
      }

      throw error;
    }
  })()
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request;
}

export async function exportAnalytics(period = "last-8-months") {
  const response = await apiClient.get(API_ENDPOINTS.CORE.ANALYTICS.EXPORT, {
    params: { period, format: "csv" },
    responseType: "blob",
    headers: { Accept: "text/csv, application/octet-stream, */*" },
  });

  const blob = response.data as Blob;
  const contentType = (response.headers && (response.headers["content-type"] || response.headers["Content-Type"])) || "";

  // If the server returned JSON (error payload) as a blob, parse and throw a proper error
  if (contentType.includes("application/json")) {
    const text = await blob.text();
    let payload: { message?: string };
    try {
      payload = JSON.parse(text) as { message?: string };
    } catch {
      payload = { message: text };
    }
    throw new ApiError(payload?.message || "Export failed", response.status, payload);
  }

  return blob;
}
