import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ForgotPasswordSentView } from "@/components/public/auth/ForgotPasswordSentView";

export const metadata: Metadata = {
  title: "Password Reset Sent",
  description: "Confirmation that a password reset email has been sent.",
};

interface ForgotPasswordSentPageProps {
  searchParams?: Promise<{
    email?: string;
  }>;
}

export default async function ForgotPasswordSentPage({ searchParams }: ForgotPasswordSentPageProps) {
  const params = await searchParams;
  const email = params?.email ?? "name@aastu.edu.et";

  return (
    <AuthSplitLayout>
      <ForgotPasswordSentView email={email} />
    </AuthSplitLayout>
  );
}