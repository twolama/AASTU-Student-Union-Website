import { z } from "zod";

export const VenueCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish().catch(""),
}).passthrough();

export type VenueCategory = z.infer<typeof VenueCategorySchema>;

export const VenueCategoryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(VenueCategorySchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

export type VenueCategoryListResponse = z.infer<typeof VenueCategoryListResponseSchema>;
