"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/services/auth.service";
import { clearCachedCurrentUser } from "@/lib/auth-cache";

export default function SignOutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isCancelled = false;

    async function performLogout() {
      try {
        await logout();
      } finally {
        if (isCancelled) {
          return;
        }

        clearCachedCurrentUser();
        queryClient.removeQueries({ queryKey: ["auth"] });
        router.replace("/login");
        router.refresh();
      }
    }

    void performLogout();

    return () => {
      isCancelled = true;
    };
  }, [queryClient, router]);

  return (
    <div className="flex min-h-[55vh] items-center justify-center text-sm text-slate-600">
      Signing out...
    </div>
  );
}
