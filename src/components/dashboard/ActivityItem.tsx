import {
  PlusCircle,
  CheckCircle2,
  UserPlus,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType } from "@/types/dashboard";

const typeConfig: Record<
  ActivityType,
  { Icon: React.ElementType; bg: string; color: string }
> = {
  club: { Icon: PlusCircle, bg: "bg-blue-50", color: "text-blue-500" },
  approval: { Icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-500" },
  student: { Icon: UserPlus, bg: "bg-purple-50", color: "text-purple-500" },
  alert: { Icon: AlertCircle, bg: "bg-amber-50", color: "text-amber-500" },
  info: { Icon: Info, bg: "bg-gray-100", color: "text-gray-500" },
};

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const config = typeConfig[activity.type];
  const { Icon, bg, color } = config;

  return (
    <li className="flex items-start gap-3 py-3">
      {/* Icon circle */}
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          bg
        )}
      >
        <Icon size={14} className={color} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-snug">
          <span className="font-semibold text-gray-900">{activity.boldLabel}: </span>
          {activity.description}
        </p>
        <p className="mt-1 text-xs text-gray-400">{activity.timestamp}</p>
      </div>
    </li>
  );
}
