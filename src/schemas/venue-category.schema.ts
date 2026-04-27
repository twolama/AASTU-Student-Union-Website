import { z } from "zod";

export const VenueCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().default(""),
});

export type VenueCategory = z.infer<typeof VenueCategorySchema>;

export const VenueCategoryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(VenueCategorySchema),
});

export type VenueCategoryListResponse = z.infer<typeof VenueCategoryListResponseSchema>;
