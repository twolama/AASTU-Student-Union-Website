import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/public/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your AASTU account.",
};

interface ResetPasswordTokenPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordTokenPage({ params }: ResetPasswordTokenPageProps) {
  return (
    <AuthSplitLayout>
      <ResetPasswordForm token={params.token} />
    </AuthSplitLayout>
  );
}