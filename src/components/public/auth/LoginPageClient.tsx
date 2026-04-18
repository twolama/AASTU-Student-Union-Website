"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/public/auth/LoginForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import type { LoginValues } from "@/lib/public/auth";

export function LoginPageClient() {
  const router = useRouter();
  const loginMutation = useAuthLogin();

  function handleSubmit(values: LoginValues) {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    }, {
      onSuccess: () => {
        router.push("/dashboard");
      }
    });
  }

  return <LoginForm onSubmit={handleSubmit} submissionError={loginMutation.error?.message ?? null} />;
}
