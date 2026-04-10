import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ForgotPasswordSentView } from "@/components/public/auth/ForgotPasswordSentView";

export const metadata: Metadata = {
  title: "Password Reset Sent",
  description: "Confirmation that a password reset email has been sent.",
};

interface ForgotPasswordSentPageProps {
  searchParams?: {
    email?: string;
  };
}

export default function ForgotPasswordSentPage({ searchParams }: ForgotPasswordSentPageProps) {
  const email = searchParams?.email ?? "name@aastu.edu.et";

  return (
    <AuthSplitLayout>
      <ForgotPasswordSentView email={email} />
    </AuthSplitLayout>
  );
}