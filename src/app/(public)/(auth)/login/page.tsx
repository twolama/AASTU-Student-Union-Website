import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { LoginForm } from "@/components/public/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the AASTU Student Union portal.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}