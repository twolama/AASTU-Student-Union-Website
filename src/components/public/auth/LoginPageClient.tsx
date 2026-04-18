"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/public/auth/LoginForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import type { LoginValues } from "@/lib/public/auth";

export function LoginPageClient() {
  const router = useRouter();
  const loginMutation = useAuthLogin();

  async function handleSubmit(values: LoginValues) {
    await loginMutation.mutateAsync({
      username: values.username,
      password: values.password,
    });

    router.push("/dashboard");
  }

  return <LoginForm onSubmit={handleSubmit} submissionError={loginMutation.error?.message ?? null} />;
}
