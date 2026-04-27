import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClubItem } from "@/types/dashboard";

interface PublicClubCardProps {
  club: ClubItem;
}

export function PublicClubCard({ club }: PublicClubCardProps) {
  const members = club.memberCount ?? "--";
  const rawDescription = club.description || "A growing student-led community focused on building skill, leadership, and impact.";
  const summary = rawDescription.replace(/<[^>]*>/g, "");
  const bannerImage = club.coverImage;

  return (
    <Link 
      href={`/public/clubs/${club.id}`}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-[#eceff6] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(14,26,66,0.12)]"
    >
      <div className={cn("relative h-36 shrink-0 bg-linear-to-r", club.headerGradient)}>
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt={`${club.name} banner`}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(7,18,56,0.62),rgba(7,18,56,0.24))]" />

        <p className="absolute right-4 top-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/85">
          {club.categoryLabel}
        </p>

        <div className="absolute -bottom-6 left-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-[#f4f6fb] text-sm font-bold text-[#1f2a44] shadow-sm">
          {club.logo ? (
            <img src={club.logo} alt={club.name} className="h-full w-full object-cover" />
          ) : (
            club.logoLabel
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-8">
        <h3 className="text-2xl font-black leading-tight text-[#0d1842] transition-colors group-hover:text-[#b6861f]">{club.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{summary}</p>

        <div className="mt-auto border-t border-slate-50 pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Compass size={14} className="text-[#b6861f]" />
            AASTU Campus
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1d49] transition-colors group-hover:text-[#b6861f]">
            Details
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
