"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthCheckboxField } from "@/components/public/auth/AuthCheckboxField";
import { AuthField } from "@/components/public/auth/AuthField";
import { AuthPasswordField } from "@/components/public/auth/AuthPasswordField";
import { loginSchema, type LoginValues } from "@/lib/public/auth";

interface LoginFormProps {
  onSubmit?: (values: LoginValues) => void | Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = loginSchema.safeParse({ email, password, rememberMe });
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof LoginValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LoginValues | undefined;
        if (key) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit?.(parsed.data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#1f2a44] sm:text-[2.1rem]">
          Welcome Back
        </h2>
        <p className="text-sm leading-6 text-[#73819d]">Please enter your credentials to access your account</p>
      </div>

      <AuthField
        id="student-email"
        label="Student Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="e.g. student@aastu.edu.et"
        autoComplete="email"
        inputMode="email"
        startIcon={<Mail size={15} />}
        error={errors.email}
      />

      <AuthPasswordField
        id="student-password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password}
      />

      <div className="flex items-center justify-between gap-4">
        <AuthCheckboxField
          id="remember-me"
          label="Remember me"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />

        <Link href="/forgot-password" className="text-sm font-semibold text-[#c49a22] transition-colors hover:text-[#a9801f]">
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="goldSolid"
        size="lg"
        isLoading={isSubmitting}
        className="h-12 w-full rounded-[12px] shadow-[0_10px_24px_rgba(196,154,34,0.22)]"
      >
        Sign In to Portal
      </Button>
    </form>
  );
}