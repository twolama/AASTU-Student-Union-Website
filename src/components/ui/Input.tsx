"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", error, ...props },
  ref
) {
  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-gray-800 shadow-sm outline-none transition-all duration-150",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            : "border-gray-200 focus:border-[#c49a22]/60 focus:ring-4 focus:ring-[#c49a22]/10",
          "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 min-h-5 px-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";