import { z } from "zod";
import { MetaSchema } from "./core.schema";

export const ClubCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export const ClubCategoryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ClubCategorySchema),
  meta: MetaSchema.optional(),
});

export type ClubCategory = z.infer<typeof ClubCategorySchema>;
export type ClubCategoryListResponse = z.infer<typeof ClubCategoryListResponseSchema>;