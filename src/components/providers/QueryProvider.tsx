"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiError } from "@/api/client";
import { readCachedCurrentUser } from "@/lib/auth-cache";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
                return false;
              }

              return failureCount < 1;
            },
            staleTime: 5 * 60 * 1000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    const cachedCurrentUser = readCachedCurrentUser();
    if (cachedCurrentUser?.data) {
      queryClient.setQueryData(["auth", "current-user"], cachedCurrentUser.data);
    }
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
