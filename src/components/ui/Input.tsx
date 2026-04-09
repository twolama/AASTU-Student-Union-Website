"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 shadow-sm outline-none transition-all duration-150",
        "placeholder:text-gray-400 focus:border-[#c49a22]/60 focus:ring-4 focus:ring-[#c49a22]/10",
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";