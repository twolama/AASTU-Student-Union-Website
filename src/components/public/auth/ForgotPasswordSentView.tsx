import Link from "next/link";
import { ArrowRight, MailCheck } from "lucide-react";

interface ForgotPasswordSentViewProps {
  email: string;
}

export function ForgotPasswordSentView({ email }: ForgotPasswordSentViewProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f6efd9] text-[#b78f23]">
        <MailCheck size={36} strokeWidth={1.8} />
      </div>

      <div className="space-y-2">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#1f2a44] sm:text-[2.1rem]">
          Check your email
        </h2>
        <p className="mx-auto max-w-[28ch] text-sm leading-6 text-[#73819d]">
          We have sent a 6-digit password recovery code to your institutional email:{" "}
          <span className="font-semibold text-[#c49a22]">{email}</span>
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href={`/reset-password/verify?email=${encodeURIComponent(email)}`}
          className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#c49a22] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,154,34,0.22)] transition-colors hover:bg-[#b58d1f]"
        >
          Enter Reset Code
        </Link>

        <Link
          href="/login"
          className="inline-flex h-12 w-full items-center justify-center rounded-[12px] border border-[#d9dbe2] bg-white px-6 text-sm font-semibold text-[#33415f] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#fbfbfd]"
        >
          Back to Login
        </Link>
      </div>

      <p className="text-sm text-[#74819b]">
        Didn&apos;t receive the email?{" "}
        <Link href={`/forgot-password?email=${encodeURIComponent(email)}`} className="font-semibold text-[#c49a22] transition-colors hover:text-[#a9801f]">
          Resend code <ArrowRight size={14} className="inline-block" />
        </Link>
      </p>
    </div>
  );
}