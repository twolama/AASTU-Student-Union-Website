import { z } from "zod";

export const LoginRequestSchema = z.object({
  username: z.string().trim().min(1, "Enter your username, student ID, or email."),
  password: z.string().min(1, "Enter your password."),
});

const LoginUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  name: z.string(),
  studentId: z.string(),
  role: z.string().nullable(),
  email: z.string().email(),
  mustChangePassword: z.boolean().optional().default(false),
  registrationDate: z.string(),
  status: z.string(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  statusCode: z.number(),
  error: z.unknown().nullable(),
  data: z.object({
    user: LoginUserSchema,
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type AuthUser = z.infer<typeof LoginUserSchema>;
