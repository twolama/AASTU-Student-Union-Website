"use client";

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/services/auth.service";
import { ChangePasswordSchema, type ChangePasswordRequest } from "@/schemas/user.schema";

export function useChangePassword() {
  return useMutation<{ success: boolean; message: string }, Error, ChangePasswordRequest>({
    mutationFn: (payload) => {
      // Validate with Zod before sending
      const validated = ChangePasswordSchema.parse(payload);
      return changePassword(validated);
    },
  });
}
