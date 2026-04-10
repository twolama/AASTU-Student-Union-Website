import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/public/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your AASTU account.",
};

interface ForgotPasswordPageProps {
  searchParams?: Promise<{
    email?: string;
  }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <AuthSplitLayout>
      <ForgotPasswordForm initialEmail={params?.email} />
    </AuthSplitLayout>
  );
}