import { z } from "zod";

export const NotificationItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  notificationType: z.string(),
  iconKey: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
  unread: z.boolean(),
  timeLabel: z.string(),
  createdAt: z.string(),
});

export type NotificationItem = z.infer<typeof NotificationItemSchema>;

export const NotificationListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(NotificationItemSchema),
  meta: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    })
    .optional(),
});

export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;
