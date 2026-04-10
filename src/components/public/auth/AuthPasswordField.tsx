"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { AuthField } from "@/components/public/auth/AuthField";

interface AuthPasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  helperText?: string;
}

export function AuthPasswordField({ label, error, helperText, id, ...props }: AuthPasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      error={error}
      helperText={helperText}
      type={isVisible ? "text" : "password"}
      autoComplete={props.autoComplete ?? "current-password"}
      startIcon={<Lock size={15} />}
      endSlot={
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8b97ab] transition-colors hover:bg-slate-100 hover:text-[#1f2a44]"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
}