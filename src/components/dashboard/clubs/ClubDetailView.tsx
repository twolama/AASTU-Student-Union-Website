"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Globe,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Share2,
  ShieldAlert,
  Trash2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { cn } from "@/lib/utils";
import type { ClubDetailItem } from "@/types/dashboard";
import { useDeleteClub } from "@/hooks/useClubs";
import { toast } from "sonner";

interface ClubDetailViewProps {
  item: ClubDetailItem;
}

const statusVariantMap = {
  active: "success",
  pending: "warning",
  rejected: "danger",
} as const;

const statusLabelMap = {
  active: "Active",
  pending: "Pending",
  rejected: "Rejected",
} as const;

export function ClubDetailView({ item }: ClubDetailViewProps) {
  const router = useRouter();
  const deleteMutation = useDeleteClub();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this club? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success("Club deleted successfully");
      router.push("/clubs");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete club");
    }
  };

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/clubs" className="text-gray-500 hover:text-gray-700">
          Clubs
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{item.name}</span>
      </nav>

      <section className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
        <div
          className="relative h-32 bg-cover bg-center sm:h-40 lg:h-48"
          style={{ backgroundImage: `linear-gradient(0deg, rgba(9,14,29,0.35), rgba(9,14,29,0.1)), url(${item.coverImageUrl})` }}
        />

        <div className="relative px-4 pb-5 pt-0 sm:px-5 lg:px-6">
          <div className="absolute -top-7 left-4 flex h-14 w-14 overflow-hidden items-center justify-center rounded-xl border-4 border-white bg-[#1d3f39] text-sm font-semibold tracking-[0.25em] text-white shadow-sm sm:left-5 sm:h-16 sm:w-16 lg:left-6">
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              item.logoLabel
            )}
          </div>

          <div className="pt-10 sm:pt-12">
            <h1 className="text-2xl font-bold tracking-tight text-[#1f2a44] sm:text-3xl">{item.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <Badge variant={statusVariantMap[item.status]} className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
                {statusLabelMap[item.status]}
              </Badge>

              <span className="inline-flex items-center gap-1.5">
                <Trophy size={14} className="text-[#c49a22]" />
                {item.categoryLabel}
              </span>

              {item.departmentLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe size={14} className="text-[#c49a22]" />
                  {item.departmentLabel}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-[#c49a22]" />
                {item.locationLabel}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link href={`/clubs/${item.id}/edit`}>
                <Button variant="outline" size="md" className="h-9 rounded-[10px] px-4">
                  <Pencil size={14} />
                  Edit Club
                </Button>
              </Link>

              <Button type="button" variant="gold" size="md" className="h-9 rounded-[10px] px-4">
                <ShieldAlert size={14} />
                Change Status
              </Button>

              <Button 
                type="button" 
                variant="primary" 
                size="md" 
                className="h-9 rounded-[10px] bg-[#dc2626] px-4 hover:bg-[#b91c1c] active:bg-[#991b1b]"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {item.stats.map((stat) => (
          <article key={stat.id} className="rounded-[10px] border border-gray-200 bg-white px-4 py-5 text-center shadow-sm">
            <p className="text-[30px] font-bold leading-none tracking-tight text-[#1f2a44]">{stat.value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-gray-500">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#1f2a44]">About the Club</h2>
            <div className="mt-3 space-y-4 text-sm leading-7 text-gray-600">
              {item.about.map((paragraph, index) => (
                <p key={`${item.id}-about-${index}`}>{paragraph}</p>
              ))}
            </div>
          </article>

          <div className="grid gap-4 lg:grid-cols-2">
            {item.contacts.map((contact) => (
              <article key={contact.id} className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-lg font-bold text-[#1f2a44]">{contact.roleLabel}</h3>

                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 overflow-hidden items-center justify-center rounded-full bg-[#f3ead0] text-sm font-semibold text-[#8c6c14]">
                    {contact.avatarUrl ? (
                      <img src={contact.avatarUrl} alt={contact.name} className="h-full w-full object-cover" />
                    ) : (
                      contact.initials
                    )}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.subtitle}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="inline-flex items-start gap-2">
                    <Mail size={14} className="mt-0.5 text-[#c49a22]" />
                    {contact.email}
                  </p>
                  <p className="inline-flex items-start gap-2">
                    <Phone size={14} className="mt-0.5 text-[#c49a22]" />
                    {contact.phone}
                  </p>
                  <p className="inline-flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 text-[#c49a22]" />
                    {contact.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <article className="rounded-[10px] border border-[#223264] bg-[#1f2a44] p-4 text-white shadow-sm">
            <h2 className="text-base font-semibold">Connect &amp; Resources</h2>

            <a
              href={item.links.website}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-between rounded-[8px] bg-white/8 px-3 py-2 text-sm transition-colors hover:bg-white/14"
            >
              <span className="inline-flex items-center gap-2">
                <LinkIcon size={14} />
                Official Website
              </span>
              <ExternalLink size={14} />
            </a>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Open website"
              >
                <Globe size={14} />
              </button>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Share resources"
              >
                <Share2 size={14} />
              </button>
            </div>

            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">External Membership</p>
              <a
                href={item.links.externalMembership}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block break-all rounded-[8px] bg-[#18213a] px-3 py-2 text-xs text-[#d6ddf7] hover:text-white"
              >
                {item.links.externalMembership}
              </a>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#1f2a44]">Upcoming Events</h2>
              <Link href="/events" className="text-xs font-semibold text-[#c49a22] hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {item.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[8px] bg-[#f3f6fd] text-[#1f2a44]">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-500">{event.month}</span>
                    <span className="text-sm font-bold leading-none">{event.day}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{event.title}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays size={12} />
                      {event.timeVenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#1f2a44]">Recent Activity</h2>

            <div className="mt-3 space-y-4">
              {item.recentActivities.map((activity, index) => (
                <div key={activity.id} className="relative pl-4">
                  {index < item.recentActivities.length - 1 ? (
                    <span className="absolute left-[4px] top-2 h-[calc(100%+12px)] w-px bg-gray-200" />
                  ) : null}
                  <span className={cn("absolute left-0 top-1.5 h-2 w-2 rounded-full", index === 0 ? "bg-[#c49a22]" : "bg-gray-300")} />
                  <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <DashboardFooter />
    </div>
  );
}
