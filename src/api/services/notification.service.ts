import { apiClient } from "@/api/client";
import { NOTIFICATION_ENDPOINTS } from "@/api/endpoints";
import {
  NotificationListResponseSchema,
  type NotificationListResponse,
} from "@/schemas/notification.schema";

const NOTIFICATION_LIST_CACHE_TTL_MS = 60 * 1000;

type CacheEntry<T> = {
  payload: T;
  expiresAt: number;
};

const notificationListCache = new Map<string, CacheEntry<NotificationListResponse>>();
const inFlightNotificationRequests = new Map<string, Promise<NotificationListResponse>>();

function getCachedNotifications(key: string) {
  const cached = notificationListCache.get(key);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    notificationListCache.delete(key);
    return null;
  }

  return cached.payload;
}

function clearNotificationCache() {
  notificationListCache.clear();
  inFlightNotificationRequests.clear();
}

export const notificationService = {
  getNotifications: async (page = 1, limit = 10) => {
    const cacheKey = `${page}:${limit}`;
    const cached = getCachedNotifications(cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightNotificationRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const request = apiClient
      .get<NotificationListResponse>(NOTIFICATION_ENDPOINTS.LIST, {
        params: { page, limit },
      })
      .then((response) => {
        const parsed = NotificationListResponseSchema.parse(response.data);
        notificationListCache.set(cacheKey, {
          payload: parsed,
          expiresAt: Date.now() + NOTIFICATION_LIST_CACHE_TTL_MS,
        });
        return parsed;
      })
      .finally(() => {
        inFlightNotificationRequests.delete(cacheKey);
      });

    inFlightNotificationRequests.set(cacheKey, request);
    return request;
  },

  markRead: async (id: string) => {
    const response = await apiClient.post(NOTIFICATION_ENDPOINTS.MARK_READ(id));
    clearNotificationCache();
    return response.data;
  },

  markAllRead: async () => {
    const response = await apiClient.post(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
    clearNotificationCache();
    return response.data;
  },
};
