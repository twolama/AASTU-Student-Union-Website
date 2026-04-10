"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: ReactNode;
}

export function AuthCheckboxField({ label, description, className, id, ...props }: AuthCheckboxFieldProps) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm text-[#52617d]", className)} htmlFor={id}>
      <span className="relative mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className="peer h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-[#cfd7e4] bg-white outline-none transition-colors checked:border-[#c49a22] checked:bg-[#c49a22] focus:ring-4 focus:ring-[#c49a22]/10"
          {...props}
        />
        <svg
          viewBox="0 0 12 10"
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          aria-hidden="true"
        >
          <path d="M4.5 7.2 1.7 4.4 0.5 5.6 4.5 9.6 11.5 2.6 10.3 1.4 4.5 7.2Z" fill="currentColor" />
        </svg>
      </span>

      <span className="leading-5">
        <span className="font-medium text-[#43516b]">{label}</span>
        {description ? <span className="block text-xs text-[#76839b]">{description}</span> : null}
      </span>
    </label>
  );
}