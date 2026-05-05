"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/services/auth.service";

type UseCurrentUserOptions = {
  enabled?: boolean;
};

export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUser,
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 15 * 60_000,
    gcTime: 30 * 60_000,
  });
}
