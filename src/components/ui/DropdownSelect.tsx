"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

interface DropdownSelectProps<T extends string = string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onValueChange: (value: T) => void;
  className?: string;
}

export function DropdownSelect<T extends string = string>({
  label,
  value,
  options,
  onValueChange,
  className,
}: DropdownSelectProps<T>) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("space-y-2", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">{label}</p>

      <div className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3.5 text-left text-sm text-gray-800 shadow-sm transition-colors",
            "hover:border-[#c49a22]/50 focus:outline-none focus:ring-4 focus:ring-[#c49a22]/10"
          )}
        >
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronDown size={16} className={cn("shrink-0 text-gray-400 transition-transform", open && "rotate-180")} />
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <ul role="listbox" className="max-h-60 overflow-auto py-1">
              {options.map((option) => {
                const isActive = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        onValueChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-3.5 py-2.5 text-left text-sm transition-colors duration-150",
                        isActive
                          ? "bg-[#fdf8ec] font-medium text-[#8c6c14]"
                          : "text-gray-700 hover:bg-[#f8f1da] hover:text-[#8c6c14]"
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}