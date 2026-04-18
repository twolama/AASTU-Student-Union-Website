"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/services/auth.service";
import type { LoginRequest, LoginResponse } from "@/schemas/auth.schema";

export function useAuthLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: (payload) => login(payload),
    retry: false,
  });
}
