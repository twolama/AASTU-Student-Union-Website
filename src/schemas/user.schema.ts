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
    roles: z.array(z.string()).optional(),
    role: z.string().nullable().optional(),
    rolesDetails: z.array(RoleDetailsSchema).optional(),
    roleDetails: RoleDetailsSchema.nullable().optional(),
    permissions: z.array(z.string()).optional(),
    djangoPermissions: z.array(z.string()).optional(),
    initials: z.string().optional(),
    bio: z.string().nullable().optional(),
  })
  .passthrough();

export const CurrentUserResponseSchema = z
  .object({
    success: z.boolean(),
    data: CurrentUserDataSchema,
  })
  .passthrough();

export type CurrentUser = z.infer<typeof CurrentUserDataSchema>;

export const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  avatar: z.any().optional().nullable(),
  phone_number: z.string().optional(),
  dorm_block: z.string().optional(),
  dorm_room: z.string().optional(),
  department: z.string().uuid().optional(),
  bio: z.string().optional().nullable(),
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

export const UserPermissionsSchema = z
  .object({
    success: z.boolean(),
    message: z.string().optional(),
    data: z.object({
      userId: z.string(),
      permissions: z.array(z.string()),
      djangoPermissions: z.array(z.string()).optional(),
    }),
  })
  .passthrough();

export type UserPermissionsResponse = z.infer<typeof UserPermissionsSchema>;

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;
