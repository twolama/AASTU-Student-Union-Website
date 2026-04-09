"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 shadow-sm outline-none transition-all duration-150",
        "placeholder:text-gray-400 focus:border-[#c49a22]/60 focus:ring-4 focus:ring-[#c49a22]/10",
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";