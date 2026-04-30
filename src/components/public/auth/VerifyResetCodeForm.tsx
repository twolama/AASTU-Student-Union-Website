"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ClipboardEvent } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthField } from "@/components/public/auth/AuthField";
import { resendResetOtp, verifyResetOtp } from "@/api/services/auth.service";

interface VerifyResetCodeFormProps {
  initialEmail?: string;
}

export function VerifyResetCodeForm({ initialEmail = "" }: VerifyResetCodeFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  const otp = digits.join("");

  function focusInput(index: number) {
    inputsRef.current[index]?.focus();
  }

  function updateDigit(index: number, value: string) {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = sanitized;
      return next;
    });

    if (sanitized && index < 5) {
      focusInput(index + 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const raw = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!raw) return;
    const nextDigits = Array(6).fill("");
    raw.split("").slice(0, 6).forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    setDigits(nextDigits);
    const firstEmpty = nextDigits.findIndex((value) => !value);
    focusInput(firstEmpty === -1 ? 5 : firstEmpty);
    event.preventDefault();
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Enter your registered institutional email.");
      return;
    }

    if (otp.length !== 6) {
      setError("Enter the full 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyResetOtp({ email, otp });
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (unknownError: unknown) {
      const errorDetail = unknownError as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setError(errorDetail.response?.data?.error || errorDetail.response?.data?.message || errorDetail.message || "Invalid code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Enter your email first to resend the code.");
      return;
    }

    setIsResending(true);

    try {
      await resendResetOtp({ email });
      setMessage("A new verification code has been sent. Check your email.");
      setDigits(Array(6).fill(""));
      focusInput(0);
    } catch (unknownError: unknown) {
      const errorDetail = unknownError as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setError(errorDetail.response?.data?.error || errorDetail.response?.data?.message || errorDetail.message || "Unable to resend code. Try again later.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleVerify} noValidate>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f6efd9] text-[#b78f23]">
            <Mail size={36} />
          </div>
          <div>
            <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#1f2a44] sm:text-[2.1rem]">
              Enter verification code
            </h2>
            <p className="text-sm leading-6 text-[#73819d]">
              Type the 6-digit code sent to your email. You can resend the code if needed.
            </p>
          </div>
        </div>

        <AuthField
          id="verification-email"
          label="Institutional Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name.surname@aastu.edu.et"
          autoComplete="email"
          inputMode="email"
          error={error ?? undefined}
          helperText="Enter the email address that received the reset code."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[0.82rem] font-semibold text-[#33415f]">Verification Code</label>
        <div className="grid grid-cols-6 gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => (inputsRef.current[index] = element)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digit && index > 0) {
                  focusInput(index - 1);
                }
              }}
              onPaste={handlePaste}
              className="h-14 w-full rounded-2xl border border-[#d9dbe2] bg-white text-center text-[1.35rem] font-semibold tracking-[0.45em] text-[#1a202c] outline-none transition focus:border-[#c49a22] focus:ring-2 focus:ring-[#c49a22]/20"
            />
          ))}
        </div>
        <p className="text-sm text-[#73819d]">Enter the 6-digit code we sent to your email.</p>
      </div>

      {message ? <p className="text-sm font-medium text-[#2a7c2a]">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="space-y-3">
        <Button
          type="submit"
          variant="goldSolid"
          size="lg"
          isLoading={isSubmitting}
          className="h-12 w-full rounded-[12px] shadow-[0_10px_24px_rgba(196,154,34,0.22)]"
        >
          Verify Code
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          isLoading={isResending}
          onClick={handleResend}
          className="h-12 w-full rounded-[12px] border-[#c49a22] text-[#33415f]"
        >
          <RefreshCw size={16} className="mr-2" />
          Resend Code
        </Button>
      </div>

      <p className="text-center text-sm text-[#74819b]">
        Remembered your password? <Link href="/login" className="font-semibold text-[#c49a22] transition-colors hover:text-[#a9801f]">Back to login</Link>
      </p>
    </form>
  );
}
