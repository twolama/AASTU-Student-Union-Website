import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Globe, Share2, User, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClubItem, ClubStatus } from "@/types/dashboard";

const statusVariantMap: Record<ClubStatus, "success" | "warning" | "danger"> = {
  active: "success",
  pending: "warning",
  rejected: "danger",
};

const statusLabelMap: Record<ClubStatus, string> = {
  active: "Active",
  pending: "Pending",
  rejected: "Rejected",
};

interface ClubCardProps {
  item: ClubItem;
}

export function ClubCard({ item }: ClubCardProps) {
  const actionLabel =
    item.status === "pending"
      ? "Review Details"
      : item.status === "rejected"
      ? "View Appeal"
      : "Manage Club";

  return (
    <article className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
      <div className={cn("relative h-24 bg-gradient-to-r", item.headerGradient)}>
        <div className="absolute -bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-md border-2 border-white bg-[#f4f6fb] text-sm font-bold text-[#1f2a44] shadow-sm">
          {item.logoLabel}
        </div>
      </div>

      <div className="space-y-3 p-4 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold leading-tight text-[#1f2a44]">
              <Link href={`/clubs/${item.id}`} className="transition-colors hover:text-[#c49a22]">
                {item.name}
              </Link>
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c49a22]">{item.categoryLabel}</p>
          </div>
          <Badge variant={statusVariantMap[item.status]} className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
            {statusLabelMap[item.status]}
          </Badge>
        </div>

        <div className="space-y-1 text-sm text-gray-600">
          <p className="inline-flex items-center gap-1.5">
            <User size={13} className="text-gray-400" />
            Pres: {item.presidentName}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <UserCog size={13} className="text-gray-400" />
            Advisor: {item.advisorName}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f4f8] text-[#7a879f] hover:bg-[#e9edf5]"
              aria-label={`Open ${item.name} website`}
            >
              <Globe size={13} />
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f4f8] text-[#7a879f] hover:bg-[#e9edf5]"
              aria-label={`Share ${item.name}`}
            >
              <Share2 size={13} />
            </button>
          </div>

          <Link
            href={`/clubs/${item.id}/edit`}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-[11px] font-medium transition-colors",
              item.status === "pending"
                ? "border border-[#c49a22] bg-white text-[#c49a22] hover:bg-[#fdf8ec]"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}