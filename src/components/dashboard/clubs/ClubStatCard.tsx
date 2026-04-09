import { Clock3, Layers3, Users } from "lucide-react";
import type { ClubStat } from "@/types/dashboard";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Clock3,
  Layers3,
};

interface ClubStatCardProps {
  item: ClubStat;
}

export function ClubStatCard({ item }: ClubStatCardProps) {
  const Icon = iconMap[item.icon] ?? Users;

  return (
    <article className="flex items-center gap-4 rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f5fa] text-[#7988a4]">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{item.title}</p>
        <p className="text-3xl font-bold leading-none tracking-tight text-[#1f2a44]">{item.value}</p>
      </div>
    </article>
  );
}