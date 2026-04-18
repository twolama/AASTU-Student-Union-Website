import { z } from "zod";

const CollegeDetailsSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    abbreviation: z.string().optional(),
  })
  .passthrough();

const DepartmentDetailsSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional(),
    college: z.string().optional(),
    collegeDetails: CollegeDetailsSchema.optional(),
  })
  .passthrough();

const RoleDetailsSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    isStaffRole: z.boolean().optional(),
  })
  .passthrough();

export const CurrentUserDataSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    studentId: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    avatar: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    dormBlock: z.string().nullable().optional(),
    dormRoom: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    departmentDetails: DepartmentDetailsSchema.nullable().optional(),
    college: z.string().nullable().optional(),
    collegeDetails: CollegeDetailsSchema.nullable().optional(),
    role: z.string().nullable().optional(),
    roleDetails: RoleDetailsSchema.nullable().optional(),
    initials: z.string().optional(),
  })
  .passthrough();

export const CurrentUserResponseSchema = z
  .object({
    success: z.boolean(),
    data: CurrentUserDataSchema,
  })
  .passthrough();

export type CurrentUser = z.infer<typeof CurrentUserDataSchema>;
