import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { LoginPageClient } from "@/components/public/auth/LoginPageClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the AASTU Student Union portal.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginPageClient />
    </AuthSplitLayout>
  );
}