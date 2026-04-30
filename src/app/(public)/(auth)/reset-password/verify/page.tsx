import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { VerifyResetCodeForm } from "@/components/public/auth/VerifyResetCodeForm";

export const metadata: Metadata = {
  title: "Verify Reset Code",
  description: "Enter the verification code sent to your email to continue resetting your password.",
};

interface VerifyResetCodePageProps {
  searchParams?: Promise<{
    email?: string;
  }>;
}

export default async function VerifyResetCodePage({ searchParams }: VerifyResetCodePageProps) {
  const params = await searchParams;
  const email = params?.email ?? "";

  return (
    <AuthSplitLayout>
      <VerifyResetCodeForm initialEmail={email} />
    </AuthSplitLayout>
  );
}
