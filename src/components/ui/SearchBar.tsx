"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ containerClassName, className, ...props }: SearchBarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center",
        containerClassName
      )}
    >
      <Search
        size={15}
        className="absolute left-3 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        placeholder="Search ..."
        className={cn(
          "h-9 w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 text-sm",
          "text-gray-700 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-[#c49a22]/40 focus:border-[#c49a22]/60",
          "transition-all duration-150",
          className
        )}
        {...props}
      />
    </div>
  );
}
