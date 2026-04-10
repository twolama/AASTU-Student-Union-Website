import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your student email.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Enter your institutional email.").email("Enter a valid institutional email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export interface PasswordCriterion {
  label: string;
  matched: boolean;
}

export interface PasswordStrengthState {
  percent: number;
  message: string;
  tone: "neutral" | "success";
  criteria: PasswordCriterion[];
}

const passwordStrengthMap = [0, 18, 42, 68, 85];

export function getPasswordStrength(password: string): PasswordStrengthState {
  const criteria: PasswordCriterion[] = [
    { label: "8+ characters", matched: password.length >= 8 },
    { label: "One uppercase", matched: /[A-Z]/.test(password) },
    { label: "One number", matched: /\d/.test(password) },
    { label: "Special character", matched: /[^A-Za-z0-9]/.test(password) },
  ];

  const matchedCount = criteria.filter((criterion) => criterion.matched).length;
  const percent = passwordStrengthMap[matchedCount] ?? 0;

  return {
    percent,
    tone: matchedCount === criteria.length ? "success" : "neutral",
    message:
      matchedCount === criteria.length
        ? "Great! Your password is secure and meets all requirements."
        : "Add the missing requirements to strengthen your password.",
    criteria,
  };
}