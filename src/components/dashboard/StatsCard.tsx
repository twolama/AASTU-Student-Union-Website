import {
  GraduationCap,
  Users2,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCard } from "@/types/dashboard";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Users2,
  ClipboardList,
};

interface StatsCardProps {
  card: StatCard;
}

export function StatsCard({ card }: StatsCardProps) {
  const Icon = iconMap[card.icon] ?? GraduationCap;

  const trendColor =
    card.requiresAttention
      ? "text-amber-500"
      : card.trendDirection === "up"
      ? "text-emerald-500"
      : card.trendDirection === "down"
      ? "text-red-500"
      : "text-gray-400";

  const TrendIcon = card.requiresAttention
    ? AlertCircle
    : card.trendDirection === "up"
    ? TrendingUp
    : card.trendDirection === "down"
    ? TrendingDown
    : null;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{card.title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {card.value}
          </p>
        </div>

        {/* Icon */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: card.iconBg }}
        >
          <Icon size={20} className="text-[#c49a22]" />
        </div>
      </div>

      {/* Trend row */}
      <div className={cn("mt-4 flex items-center gap-1.5 text-xs font-medium", trendColor)}>
        {TrendIcon && <TrendIcon size={13} />}
        <span>{card.trend}</span>
      </div>
    </article>
  );
}
