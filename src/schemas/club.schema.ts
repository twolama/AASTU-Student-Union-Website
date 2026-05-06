import { z } from "zod";
import { ClubCategorySchema } from "./club-category.schema";
import { MetaSchema } from "./core.schema";

export const ClubStatusSchema = z.enum(["active", "inactive", "pending"]);

export const ClubUserDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  initials: z.string().optional(),
  email: z.string().email().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  departmentName: z.string().nullable().optional(),
  dormBlock: z.string().nullable().optional(),
  dormRoom: z.string().nullable().optional(),
}).passthrough();

export const ClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: ClubStatusSchema.default("active"),
  category: z.string().uuid().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  categoryDetails: ClubCategorySchema.optional().nullable(),
  department: z.string().uuid().optional().nullable(),
  departmentName: z.string().optional().nullable(),
  departmentDetails: z.any().optional().nullable(),
  locationLabel: z.string().optional().nullable(),
  logoLabel: z.string().optional().nullable(),
  logo: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  description: z.string().optional().nullable(),
  president: z.string().uuid().optional().nullable(),
  presidentName: z.string().optional().nullable(),
  presidentDetails: ClubUserDetailSchema.optional().nullable(),
  advisor: z.string().uuid().optional().nullable(),
  advisorName: z.string().optional().nullable(),
  advisorDetails: ClubUserDetailSchema.optional().nullable(),
  links: z.record(z.string(), z.any()).optional().default({}),
  proposalFile: z.string().nullable().optional(),
  showProposal: z.boolean().optional().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export type Club = z.infer<typeof ClubSchema>;

export const ClubListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ClubSchema),
  meta: MetaSchema.optional(),
});

export type ClubListResponse = z.infer<typeof ClubListResponseSchema>;
