"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthField } from "@/components/public/auth/AuthField";
import { AuthPasswordField } from "@/components/public/auth/AuthPasswordField";
import { AuthPasswordStrength } from "@/components/public/auth/AuthPasswordStrength";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/public/auth";
import { resetPassword as resetPasswordRequest } from "@/api/services/auth.service";

interface ResetPasswordFormProps {
  initialEmail?: string;
  initialOtp?: string;
  onSubmit?: (values: ResetPasswordValues) => void | Promise<void>;
}

export function ResetPasswordForm({ initialEmail = "", initialOtp = "", onSubmit }: ResetPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = resetPasswordSchema.safeParse({ email, otp, password, confirmPassword });
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof ResetPasswordValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ResetPasswordValues | undefined;
        if (key) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      setFormError(null);
      return;
    }

    setErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(parsed.data);
      } else {
        await resetPasswordRequest({
          email: parsed.data.email,
          otp: parsed.data.otp,
          password: parsed.data.password,
        });
        router.push("/login?reset=success");
      }
    } catch (unknownError: unknown) {
      const error = unknownError as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setFormError(
        error.response?.data?.message || error.message || "Failed to reset your password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#1f2a44] sm:text-[2.1rem]">
          Create new password
        </h2>
        <p className="text-sm leading-6 text-[#73819d]">
          Enter the 6-digit code from your email and choose a new password.
        </p>
      </div>

      <AuthField
        id="email"
        label="Institutional Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name.surname@aastu.edu.et"
        autoComplete="email"
        inputMode="email"
        error={errors.email}
        disabled={Boolean(initialEmail)}
      />

      {!initialOtp ? (
        <AuthField
          id="otp"
          label="Verification Code"
          type="text"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          placeholder="123456"
          inputMode="numeric"
          error={errors.otp}
          helperText="Enter the 6-digit code we sent to your email."
        />
      ) : null}

      <AuthPasswordField
        id="new-password"
        label="New Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter new password"
        autoComplete="new-password"
        error={errors.password}
      />

      <AuthPasswordField
        id="confirm-new-password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <AuthPasswordStrength password={password} />

      {formError ? (
        <p className="text-sm font-medium text-red-600">{formError}</p>
      ) : null}

      <Button
        type="submit"
        variant="goldSolid"
        size="lg"
        isLoading={isSubmitting}
        className="h-12 w-full rounded-[12px] shadow-[0_10px_24px_rgba(196,154,34,0.22)]"
      >
        Reset Password
      </Button>

      <div className="pt-1 text-center">
        <Link href="/login" className="text-sm font-semibold text-[#c49a22] transition-colors hover:text-[#a9801f]">
          Back to Login
        </Link>
      </div>
    </form>
  );
}