"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LoginForm } from "@/components/public/auth/LoginForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import { logout } from "@/api/services/auth.service";
import type { LoginValues } from "@/lib/public/auth";

export function LoginPageClient() {
  const router = useRouter();
  const loginMutation = useAuthLogin();
  const currentUserQuery = useCurrentUser();

  useEffect(() => {
    if (currentUserQuery.data) {
      router.replace("/dashboard");
    }
  }, [currentUserQuery.data, router]);

  if (currentUserQuery.isLoading) {
    return (
      <div className="flex items-center justify-center px-6 py-12" aria-busy="true">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  async function handleSubmit(values: LoginValues) {
    try {
      const response = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
        remember: values.rememberMe,
      });

      if (response.data.user.mustChangePassword) {
        router.push("/force-password-change");
        return;
      }

      // Schedule a client-side fallback logout for non-remembered sessions (24 hours)
      try {
        if (!values.rememberMe) {
          const ms = 24 * 60 * 60 * 1000; // 24 hours
          const logoutAt = Date.now() + ms;
          try {
            localStorage.setItem("auth.logoutAt", String(logoutAt));
          } catch {}

          // Schedule logout in this session
          setTimeout(async () => {
            try {
              await logout();
            } finally {
              router.push("/login");
            }
          }, ms);
        } else {
          try {
            localStorage.removeItem("auth.logoutAt");
          } catch {}
        }
      } catch {}

      router.push("/dashboard");
    } catch {
      // Error state is exposed via loginMutation.error and shown by LoginForm.
    }
  }

  return <LoginForm onSubmit={handleSubmit} submissionError={loginMutation.error?.message ?? null} />;
}
