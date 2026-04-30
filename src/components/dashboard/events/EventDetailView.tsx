import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import type { EventDetailItem } from "@/types/dashboard";

interface EventDetailViewProps {
  item: EventDetailItem;
}

const statusLabelMap = {
  "live-now": "Live Now",
  upcoming: "Upcoming",
  archived: "Archived",
} as const;

const statusVariantMap = {
  "live-now": "success",
  upcoming: "info",
  archived: "default",
} as const;

export function EventDetailView({ item }: EventDetailViewProps) {
  const attendancePercent = Math.min(100, Math.round((item.attendance.current / item.attendance.capacity) * 100));

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/events" className="text-gray-500 hover:text-gray-700">
          Events
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{item.title}</span>
      </nav>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {item.megaEvent ? (
                  <Badge variant="gold" className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
                    Mega Event
                  </Badge>
                ) : null}
                <Badge
                  variant={statusVariantMap[item.status]}
                  className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                >
                  {statusLabelMap[item.status]}
                </Badge>
              </div>

              <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1f2a44]">{item.title}</h1>
              <div 
                className="max-w-3xl text-sm text-gray-500 prose prose-sm prose-slate"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
            <div
              className="relative h-52 bg-cover bg-center sm:h-[300px]"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(7,11,24,0.15), rgba(7,11,24,0.45)), url(${item.coverImageUrl})` }}
            >
              <div className="absolute bottom-4 left-4 flex items-end gap-3 rounded-[10px] bg-black/35 px-3 py-2 text-white backdrop-blur-sm">
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[8px] border border-white/25 bg-white/10">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-white/85">{item.dateMonth}</span>
                  <span className="text-xl font-bold leading-none">{item.dateDay}</span>
                </div>

                <div>
                  <p className="text-2xl font-semibold leading-tight">{item.venueTitle}</p>
                  <p className="text-sm text-white/80">{item.venueSubtitle}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Time &amp; Duration</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-bold text-[#1f2a44]">
                <Clock3 size={16} className="text-[#c49a22]" />
                {item.timeRange}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.startDateLabel}</p>
            </article>

            <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Physical Location</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-bold text-[#1f2a44]">
                <MapPin size={16} className="text-[#c49a22]" />
                {item.locationName}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.locationWing}</p>
            </article>
          </div>

          <article className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-[#1f2a44]">About the Event</h2>
            <div 
              className="mt-3 text-sm leading-7 text-gray-600 prose prose-slate max-w-none prose-headings:text-[#1f2a44] prose-strong:text-[#1f2a44]"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </article>
        </div>

        <aside className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Link href={`/events/${item.id}/edit`}>
              <Button variant="outline" size="md" className="h-9 w-full rounded-[10px] px-2 text-xs">
                <Pencil size={14} />
                Edit
              </Button>
            </Link>
            <Button type="button" variant="outline" size="md" className="h-9 w-full rounded-[10px] px-2 text-xs">
              <ShieldAlert size={14} />
              Archive
            </Button>
            <Button type="button" variant="outline" size="md" className="h-9 w-full rounded-[10px] border-red-200 px-2 text-xs text-red-600 hover:bg-red-50">
              <Trash2 size={14} />
              Delete
            </Button>
          </div>

          <article className="rounded-[10px] border border-[#223264] bg-[#1f2a44] p-4 text-white shadow-sm">
            <h2 className="text-base font-semibold">Attendance Stats</h2>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-5xl font-bold leading-none">{item.attendance.current}</span>
              <span className="pb-1 text-lg text-white/60">/{item.attendance.capacity}</span>
            </div>
            <p className="mt-1 text-xs text-[#f1ce67]">{attendancePercent}% Full</p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#c49a22]" style={{ width: `${attendancePercent}%` }} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[8px] bg-white/8 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/65">Waitlist</p>
                <p className="text-2xl font-bold leading-none">{item.attendance.waitlist}</p>
              </div>
              <div className="rounded-[8px] bg-white/8 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/65">VIPs</p>
                <p className="text-2xl font-bold leading-none">{item.attendance.vips}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Organizing Club</p>
            <div className="mt-3">
              <p className="text-lg font-bold text-[#1f2a44]">{item.organizingClub.name}</p>
              <p className="text-xs text-gray-500">{item.organizingClub.subtitle}</p>
            </div>

            <Link href={`/clubs/${item.organizingClub.clubId}`}>
              <Button variant="gold" size="md" className="mt-4 h-9 w-full rounded-[10px]">
                <Users size={14} />
                View Club Profile
              </Button>
            </Link>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Logistics Details</p>

            <div className="mt-3 space-y-2">
              {item.logistics.map((detail) => (
                <div key={detail.id} className="rounded-[8px] bg-[#f8fafc] px-3 py-2">
                  <p className="text-[11px] font-semibold text-gray-500">{detail.label}</p>
                  <p className="text-sm font-medium text-[#1f2a44]">{detail.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
            <div
              className="h-28 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(10,14,20,0.2), rgba(10,14,20,0.45)), url(${item.mapImageUrl})` }}
            />
            <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
              <span className="font-medium text-gray-600">AASTU North Campus</span>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#c49a22] hover:underline">
                Open Maps
              </a>
            </div>
          </article>
        </aside>
      </section>

      <DashboardFooter />
    </div>
  );
}
