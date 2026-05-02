"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/public/auth/LoginForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import type { LoginValues } from "@/lib/public/auth";

export function LoginPageClient() {
  const router = useRouter();
  const loginMutation = useAuthLogin();

  async function handleSubmit(values: LoginValues) {
    try {
      const response = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      });

      if (response.data.user.mustChangePassword) {
        router.push("/force-password-change");
        return;
      }

      router.push("/dashboard");
    } catch {
      // Error state is exposed via loginMutation.error and shown by LoginForm.
    }
  }

  return <LoginForm onSubmit={handleSubmit} submissionError={loginMutation.error?.message ?? null} />;
}
