"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api/services/auth.service";

export default function AuthAutoLogout() {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    try {
      const raw = localStorage.getItem("auth.logoutAt");
      if (!raw) return;

      const logoutAt = Number(raw);
      if (!logoutAt || Number.isNaN(logoutAt)) return;

      const now = Date.now();
      if (now >= logoutAt) {
        // Expired: attempt server logout then redirect
        (async () => {
          try {
            await logout();
          } finally {
            try {
              localStorage.removeItem("auth.logoutAt");
            } catch {}
            router.push("/login");
          }
        })();
        return;
      }

      const ms = logoutAt - now;
      timer = setTimeout(async () => {
        try {
          await logout();
        } finally {
          try {
            localStorage.removeItem("auth.logoutAt");
          } catch {}
          router.push("/login");
        }
      }, ms);
    } catch (e) {
      // ignore
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return null;
}
