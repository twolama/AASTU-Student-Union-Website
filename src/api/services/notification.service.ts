import { apiClient } from "@/api/client";
import { NOTIFICATION_ENDPOINTS } from "@/api/endpoints";
import {
  NotificationListResponseSchema,
  type NotificationListResponse,
} from "@/schemas/notification.schema";

export const notificationService = {
  getNotifications: async (page = 1, limit = 10) => {
    const response = await apiClient.get<NotificationListResponse>(NOTIFICATION_ENDPOINTS.LIST, {
      params: { page, limit },
    });
    return NotificationListResponseSchema.parse(response.data);
  },

  markRead: async (id: string) => {
    const response = await apiClient.post(NOTIFICATION_ENDPOINTS.MARK_READ(id));
    return response.data;
  },

  markAllRead: async () => {
    const response = await apiClient.post(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
    return response.data;
  },
};
