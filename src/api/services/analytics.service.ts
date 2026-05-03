import { apiClient, ApiError } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export async function getAnalyticsDashboard(period = "last-8-months") {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CORE.ANALYTICS.DASHBOARD, {
      params: { period },
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 403) {
      return {
        success: false,
        data: null,
        statusCode: 403,
        forbidden: true,
        message: "You do not have permission to view analytics.",
      };
    }

    throw error;
  }
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
    let payload: any = null;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      payload = { message: text };
    }
    throw new ApiError(payload?.message || "Export failed", response.status, payload);
  }

  return blob;
}
