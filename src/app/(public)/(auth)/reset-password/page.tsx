import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/public/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your AASTU account.",
};

interface ResetPasswordPageProps {
  searchParams?: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <AuthSplitLayout>
      <ResetPasswordForm token={params?.token} />
    </AuthSplitLayout>
  );
}