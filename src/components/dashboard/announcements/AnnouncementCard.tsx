import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnnouncementCategory, AnnouncementItem } from "@/types/dashboard";

const categoryLabelMap: Record<AnnouncementCategory, string> = {
  academic: "Academic",
  social: "Social",
  union: "Union",
};

const categoryStyleMap: Record<AnnouncementCategory, string> = {
  academic: "bg-gray-100 text-gray-700",
  social: "bg-blue-50 text-blue-600",
  union: "bg-slate-100 text-slate-700",
};

interface AnnouncementCardProps {
  item: AnnouncementItem;
}

export function AnnouncementCard({ item }: AnnouncementCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-44 w-full sm:h-auto sm:w-[210px] md:w-[240px] lg:w-[260px]">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 260px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className={cn(
                "rounded-md px-2 py-0.5 font-semibold uppercase tracking-wide",
                categoryStyleMap[item.category]
              )}
            >
              {categoryLabelMap[item.category]}
            </span>
            <span className="text-gray-400">{item.publishedAgo}</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1a1a2e]">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-500">{item.summary}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <UserCircle2 size={15} className="text-gray-400" />
              <span>{item.authorName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/announcements/${item.id}/edit`}
                className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-[#c49a22] bg-white px-3 text-[11px] font-semibold text-[#c49a22] transition-colors hover:bg-[#fdf8ec]"
              >
                <Pencil size={12} />
                Edit
              </Link>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
