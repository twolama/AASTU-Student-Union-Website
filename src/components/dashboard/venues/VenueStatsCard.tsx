import { Building2, CircleCheck, Users, Wrench } from "lucide-react";
import type { VenueStat } from "@/types/dashboard";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  CircleCheck,
  Wrench,
  Users,
};

interface VenueStatsCardProps {
  item: VenueStat;
}

export function VenueStatsCard({ item }: VenueStatsCardProps) {
  const Icon = iconMap[item.icon] ?? Building2;

  return (
    <article className="flex items-center justify-between gap-3 rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">{item.title}</p>
        <p className="mt-1 text-4xl font-bold leading-none tracking-tight text-[#1f2a44]">{item.value}</p>
      </div>

      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f5fa] text-[#7f8da7]">
        <Icon size={18} />
      </span>
    </article>
  );
}
