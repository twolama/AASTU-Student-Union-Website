"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/services/auth.service";
import { readCachedCurrentUser } from "@/lib/auth-cache";

type UseCurrentUserOptions = {
  enabled?: boolean;
  hydrateFromCache?: boolean;
  staleTimeMs?: number;
  refetchOnMount?: boolean | "always";
};

export function useCurrentUser(options?: UseCurrentUserOptions) {
  const hydrateFromCache = options?.hydrateFromCache ?? true;

  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUser,
    enabled: options?.enabled ?? true,
    initialData: hydrateFromCache
      ? () => {
          const cached = readCachedCurrentUser();
          return cached?.data;
        }
      : undefined,
    retry: false,
    staleTime: options?.staleTimeMs ?? 15 * 60_000,
    refetchOnMount: options?.refetchOnMount ?? true,
    gcTime: 30 * 60_000,
  });
}
