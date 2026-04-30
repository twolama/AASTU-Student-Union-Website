"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(dayjs(value || undefined));
  const today = dayjs().startOf("day");

  const startOfMonth = viewDate.startOf("month");
  const endOfMonth = viewDate.endOf("month");
  const daysInMonth = viewDate.daysInMonth();
  
  // Day of week of the 1st (0-6, Sunday-Saturday)
  const firstDayOfWeek = startOfMonth.day();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => setViewDate(viewDate.subtract(1, "month"));
  const handleNextMonth = () => setViewDate(viewDate.add(1, "month"));

  const isDateDisabled = (day: number) => {
    const current = viewDate.date(day).startOf("day");
    if (minDate && current.isBefore(dayjs(minDate).startOf("day"))) return true;
    if (maxDate && current.isAfter(dayjs(maxDate).endOf("day"))) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return dayjs(value).isSame(viewDate.date(day), "day");
  };

  const isToday = (day: number) => {
    return today.isSame(viewDate.date(day), "day");
  };

  return (
    <div className={cn("w-full max-w-[280px] select-none rounded-[12px] bg-white p-3 shadow-xl border border-gray-100", className)}>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-bold text-[#1f2a44]">
          {viewDate.format("MMMM YYYY")}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100 text-[#8a95a8]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100 text-[#8a95a8]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day} className="text-[10px] font-bold uppercase tracking-wider text-[#8a95a8]">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} />
        ))}
        {days.map((day) => {
          const disabled = isDateDisabled(day);
          const selected = isSelected(day);
          const currentIsToday = isToday(day);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(viewDate.date(day).format("YYYY-MM-DD"))}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[8px] text-xs font-semibold transition-all",
                disabled && "text-gray-200 cursor-not-allowed",
                !disabled && !selected && "text-[#44506b] hover:bg-[#c49a22]/10 hover:text-[#c49a22]",
                selected && "bg-[#c49a22] text-white shadow-md shadow-[#c49a22]/20",
                !selected && currentIsToday && "text-[#c49a22] underline decoration-2 underline-offset-4"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
