"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/services/auth.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
