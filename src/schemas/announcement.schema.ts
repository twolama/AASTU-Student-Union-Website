import { z } from "zod";

export const AnnouncementCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export type AnnouncementCategory = z.infer<typeof AnnouncementCategorySchema>;

export const AnnouncementSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  bodyExcerpt: z.string(),
  body: z.string().optional(),
  category: z.string().uuid().nullable(),
  categoryDetails: AnnouncementCategorySchema.nullable(),
  isPinned: z.boolean().default(false),
  is_published: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  author: z.object({
    id: z.string().uuid(),
    name: z.string(),
    avatar: z.string().url().nullable(),
    initials: z.string().optional(),
  }),
  authorName: z.string().optional(),
  authorRoleName: z.string().optional(),
  image: z.string().url().nullable(),
  tags: z.array(z.string()).default([]),
  procedureSteps: z.array(z.string()).default([]),
  publishedDate: z.string(), // Formatted date string
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Announcement = z.infer<typeof AnnouncementSchema>;

export const AnnouncementListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(AnnouncementSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type AnnouncementListResponse = z.infer<typeof AnnouncementListResponseSchema>;
