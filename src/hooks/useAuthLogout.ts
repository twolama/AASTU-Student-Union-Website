"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/services/auth.service";
import { clearCachedCurrentUser } from "@/lib/auth-cache";

export function useAuthLogout() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
    onSuccess: () => {
      clearCachedCurrentUser();
    },
    retry: false,
  });
}
