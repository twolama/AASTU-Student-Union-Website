"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/services/auth.service";

export function useAuthLogout() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
    retry: false,
  });
}
