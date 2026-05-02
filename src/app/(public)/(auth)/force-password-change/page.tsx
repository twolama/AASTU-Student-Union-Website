import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/public/auth/AuthSplitLayout";
import { ForcePasswordChangeForm } from "@/components/public/auth/ForcePasswordChangeForm";

export const metadata: Metadata = {
  title: "Change Temporary Password",
  description: "Set a new password to continue to the AASTU Student Union portal.",
};

export default function ForcePasswordChangePage() {
  return (
    <AuthSplitLayout>
      <ForcePasswordChangeForm />
    </AuthSplitLayout>
  );
}
