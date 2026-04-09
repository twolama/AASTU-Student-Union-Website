"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-800 shadow-sm outline-none transition-all duration-150",
          "focus:border-[#c49a22]/60 focus:ring-4 focus:ring-[#c49a22]/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
});

Select.displayName = "Select";