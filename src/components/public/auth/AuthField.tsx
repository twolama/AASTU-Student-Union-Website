"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endSlot?: ReactNode;
}

export function AuthField({
  label,
  error,
  helperText,
  startIcon,
  endSlot,
  className,
  id,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[0.82rem] font-semibold text-[#33415f]">
        {label}
      </label>

      <div className="relative">
        {startIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#a8b2c5]">
            {startIcon}
          </span>
        ) : null}

        <Input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={cn(
            "h-12 rounded-[12px] border-[#dde3ee] bg-[#fbfcfe] text-[0.95rem] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
            startIcon ? "pl-10" : "pl-4",
            endSlot ? "pr-12" : "pr-4",
            error && "border-[#d85959] focus:border-[#d85959]/65 focus:ring-[#d85959]/10",
            className
          )}
          {...props}
        />

        {endSlot ? <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endSlot}</div> : null}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-[#d05959]">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-[#73819d]">{helperText}</p>
      ) : null}
    </div>
  );
}