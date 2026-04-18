import { z } from "zod";

export const CollegeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  abbreviation: z.string().optional(),
});

export const DepartmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  college: z.string().uuid(),
  collegeDetails: CollegeSchema.optional(),
});

export const MetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const DepartmentListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(DepartmentSchema),
  meta: MetaSchema.optional(),
});

export type Department = z.infer<typeof DepartmentSchema>;
export type College = z.infer<typeof CollegeSchema>;
export type DepartmentListResponse = z.infer<typeof DepartmentListResponseSchema>;
