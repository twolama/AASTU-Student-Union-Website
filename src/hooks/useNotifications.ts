"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/api/services/notification.service";

export function useNotifications(page = 1, limit = 10, enabled = true) {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => notificationService.getNotifications(page, limit),
    enabled,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
