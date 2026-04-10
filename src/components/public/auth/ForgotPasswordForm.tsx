"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthField } from "@/components/public/auth/AuthField";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/public/auth";

interface ForgotPasswordFormProps {
  initialEmail?: string;
  onSubmit?: (values: ForgotPasswordValues) => void | Promise<void>;
}

export function ForgotPasswordForm({ initialEmail = "", onSubmit }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid institutional email.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(parsed.data);
      } else {
        router.push(`/forgot-password/sent?email=${encodeURIComponent(parsed.data.email)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#1f2a44] sm:text-[2.1rem]">
          Reset your password
        </h2>
        <p className="text-sm leading-6 text-[#73819d]">
          Enter your institutional email to receive a password reset link.
        </p>
      </div>

      <AuthField
        id="institutional-email"
        label="Institutional Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name.surname@aastu.edu.et"
        autoComplete="email"
        inputMode="email"
        startIcon={<Mail size={15} />}
        helperText="Use the student or staff email associated with your AASTU account."
        error={error ?? undefined}
      />

      <Button
        type="submit"
        variant="goldSolid"
        size="lg"
        isLoading={isSubmitting}
        className="h-12 w-full rounded-[12px] shadow-[0_10px_24px_rgba(196,154,34,0.22)]"
      >
        Send Reset Link
      </Button>

      <div className="pt-1 text-center">
        <Link href="/login" className="text-sm font-medium text-[#52617d] transition-colors hover:text-[#1f2a44]">
          Back to Login
        </Link>
      </div>
    </form>
  );
}