"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Calendar } from "./Calendar";

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  id?: string;
  align?: "left" | "right";
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  label,
  className,
  id,
  align = "left",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = value ? dayjs(value).format("MMM DD, YYYY") : "";

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[8px] border border-gray-200 bg-white px-3 text-left text-sm font-medium transition-all",
          isOpen ? "border-[#c49a22] ring-2 ring-[#c49a22]/10" : "hover:border-gray-300",
          !value && "text-gray-400"
        )}
      >
        <span>{displayValue || placeholder}</span>
        <CalendarIcon size={16} className={cn("transition-colors", isOpen ? "text-[#c49a22]" : "text-[#8a95a8]")} />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute top-[calc(100%+4px)] z-50 animate-in fade-in zoom-in-95 duration-200",
            align === "left" ? "left-0" : "right-0"
          )}
        >
          <Calendar
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(date) => {
              onChange?.(date);
              setIsOpen(false);
            }}
            className="shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
