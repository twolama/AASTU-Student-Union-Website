import { ShieldCheck, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserManagementStat } from "@/types/dashboard";

interface UserStatsCardProps {
  item: UserManagementStat;
}

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Star,
  Users,
};

const accentClassMap: Record<UserManagementStat["accent"], string> = {
  navy: "bg-[#e8edf9] text-[#1f2a44]",
  gold: "bg-[#fbf3df] text-[#b48a1b]",
  slate: "bg-[#eef2f7] text-[#65758f]",
};

export function UserStatsCard({ item }: UserStatsCardProps) {
  const Icon = iconMap[item.icon] ?? Users;

  return (
    <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-[10px]", accentClassMap[item.accent])}>
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7b88a0]">{item.title}</p>
          <p className="text-3xl font-bold leading-none tracking-tight text-[#1f2a44]">{item.value}</p>
        </div>
      </div>
    </article>
  );
}
