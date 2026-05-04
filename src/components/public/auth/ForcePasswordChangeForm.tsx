"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { AuthPasswordField } from "@/components/public/auth/AuthPasswordField";
import { Button } from "@/components/ui/Button";
import { useChangePassword } from "@/hooks/useChangePassword";
import { parseApiFormError } from "@/lib/api-errors";

export function ForcePasswordChangeForm() {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    // Clear previous errors
    setLocalError(null);
    setFieldErrors({});

    // Client-side validation
    const localFieldErrors: Record<string, string> = {};
    if (!currentPassword) localFieldErrors.current_password = "Current password is required";
    if (!newPassword) localFieldErrors.new_password = "New password is required";
    if (!confirmPassword) localFieldErrors.confirm_password = "Please confirm your new password";
    if (newPassword && newPassword.length < 8) localFieldErrors.new_password = "New password must be at least 8 characters";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) localFieldErrors.confirm_password = "New passwords do not match";

    if (Object.keys(localFieldErrors).length > 0) {
      setFieldErrors(localFieldErrors);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const parsed = parseApiFormError(error);

      const relevantFieldErrors: Record<string, string> = {};
      ["current_password", "new_password", "confirm_password"].forEach((field) => {
        if (parsed.fieldErrors[field]) {
          relevantFieldErrors[field] = parsed.fieldErrors[field];
        }
      });

      if (Object.keys(relevantFieldErrors).length > 0) {
        setFieldErrors(relevantFieldErrors);
      }

      if (parsed.nonFieldErrors.length > 0) {
        setLocalError(parsed.nonFieldErrors[0]);
        return;
      }

      if (Object.keys(relevantFieldErrors).length === 0) {
        setLocalError(parsed.message || "Unable to change password. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#1f2a44] sm:text-[2.1rem]">
          Change Temporary Password
        </h2>
        <p className="text-sm leading-6 text-[#73819d]">
          You must set a new password before accessing the portal.
        </p>
      </div>

      <AuthPasswordField
        id="temp-password"
        label="Temporary Password"
        value={currentPassword}
        onChange={(event) => {
          setCurrentPassword(event.target.value);
          clearFieldError("current_password");
        }}
        placeholder="Enter temporary password"
        autoComplete="current-password"
        error={fieldErrors.current_password}
      />

      <AuthPasswordField
        id="new-password"
        label="New Password"
        value={newPassword}
        onChange={(event) => {
          setNewPassword(event.target.value);
          clearFieldError("new_password");
        }}
        placeholder="Enter new password"
        autoComplete="new-password"
        error={fieldErrors.new_password}
      />

      <AuthPasswordField
        id="confirm-new-password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
          clearFieldError("confirm_password");
        }}
        placeholder="Confirm new password"
        autoComplete="new-password"
        error={fieldErrors.confirm_password}
      />

      {localError ? (
        <div className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{localError}</p>
        </div>
      ) : null}

      <Button
        type="submit"
        variant="goldSolid"
        size="lg"
        isLoading={changePasswordMutation.isPending}
        className="h-12 w-full rounded-[12px] shadow-[0_10px_24px_rgba(196,154,34,0.22)]"
      >
        Save New Password
      </Button>
    </form>
  );
}
