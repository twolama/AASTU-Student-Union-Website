"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/services/auth.service";
import { readCachedCurrentUser } from "@/lib/auth-cache";

type UseCurrentUserOptions = {
  enabled?: boolean;
};

export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUser,
    enabled: options?.enabled ?? true,
    initialData: () => {
      const cached = readCachedCurrentUser();
      return cached?.data;
    },
    retry: false,
    staleTime: 15 * 60_000,
    gcTime: 30 * 60_000,
  });
}
