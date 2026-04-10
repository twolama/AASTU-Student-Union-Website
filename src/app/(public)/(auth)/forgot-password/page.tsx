import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/public/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your AASTU account.",
};

interface ForgotPasswordPageProps {
  searchParams?: {
    email?: string;
  };
}

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  return (
    <AuthSplitLayout>
      <ForgotPasswordForm initialEmail={searchParams?.email} />
    </AuthSplitLayout>
  );
}