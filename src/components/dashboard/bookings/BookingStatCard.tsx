import * as LucideIcons from "lucide-react";
import type { BookingStat } from "@/types/dashboard";

interface BookingStatCardProps {
  item: BookingStat;
}

const accentClasses: Record<BookingStat["accent"], string> = {
  navy: "text-[#1f2a44] bg-[#f1f4fb]",
  gold: "text-[#b18716] bg-[#fdf8ec]",
  green: "text-emerald-600 bg-emerald-50",
  red: "text-rose-500 bg-rose-50",
};

const valueClasses: Record<BookingStat["accent"], string> = {
  navy: "text-[#1f2a44]",
  gold: "text-[#9c7813]",
  green: "text-emerald-600",
  red: "text-rose-500",
};

export function BookingStatCard({ item }: BookingStatCardProps) {
  const Icon = (LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon | undefined) ?? LucideIcons.Circle;

  return (
    <article className="rounded-[12px] border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#8a95a8]">{item.title}</p>
          <p className={`mt-2 text-[36px] font-bold leading-none tracking-tight ${valueClasses[item.accent]}`}>{item.value}</p>
        </div>

        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${accentClasses[item.accent]}`}>
          <Icon size={16} />
        </span>
      </div>
    </article>
  );
}
