import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, CircleAlert, MapPinned, Pencil, Phone, Star, User, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { cn } from "@/lib/utils";
import type { VenueDetailItem } from "@/types/dashboard";

interface VenueDetailViewProps {
  item: VenueDetailItem;
}

const statusVariantMap = {
  active: "success",
  maintenance: "warning",
  inactive: "default",
} as const;

const scheduleStatusStyles = {
  confirmed: "bg-[#f5edcc] text-[#8c6c14]",
  pending: "bg-[#e8edf8] text-[#5b6881]",
} as const;

export function VenueDetailView({ item }: VenueDetailViewProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/venues" className="text-gray-500 hover:text-gray-700">
          Venues
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{item.name}</span>
      </nav>

      <section className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
        <div
          className="relative min-h-[200px] bg-cover bg-center sm:min-h-[220px] lg:min-h-[240px]"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(12,22,46,0.35), rgba(12,22,46,0.72)), url(${item.coverImageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#132a61]/25 via-[#132a61]/40 to-[#0d1632]/85" />

          <div className="relative z-10 flex min-h-[200px] items-end p-3 sm:min-h-[220px] sm:p-4 lg:min-h-[240px] lg:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border-2 border-white/80 bg-[#2e2121]/65 text-[10px] font-semibold tracking-[0.16em] text-[#f5e7c4] sm:h-16 sm:w-16 sm:text-xs">
                  {item.logoLabel}
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">{item.name}</h1>
                  <p className="max-w-2xl text-xs leading-relaxed text-white/90 sm:text-sm">{item.subtitle}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/85">
                    <span className="inline-flex items-center gap-1">
                      <User size={12} />
                      {item.capacityLabel}
                    </span>
                    <Badge variant={statusVariantMap[item.status]} className="px-2 py-0.5 text-[10px] uppercase">
                      {item.status}
                    </Badge>
                    <span className="inline-flex items-center gap-1">
                      <MapPinned size={12} />
                      {item.locationLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center">
                  <Link href={`/venues/${item.id}/edit`} className="w-full lg:w-auto">
                    <Button variant="outline" className="h-9 w-full whitespace-nowrap rounded-[10px] border-white/35 bg-white/10 px-3 text-xs text-white hover:bg-white/25 sm:px-4 sm:text-sm lg:min-w-[148px]">
                      <Pencil size={14} />
                      Edit Venue
                    </Button>
                  </Link>
                  <Button variant="goldSolid" className="h-9 w-full whitespace-nowrap rounded-[10px] px-3 text-xs sm:px-4 sm:text-sm lg:min-w-[148px]">
                    <CalendarDays size={14} />
                    Book Venue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
              <CircleAlert size={18} className="text-[#1f2a44]" />
              Venue Overview
            </h2>
            <div className="mt-3 space-y-4 text-sm leading-7 text-gray-600">
              {item.overview.map((paragraph, index) => (
                <p key={`${item.id}-overview-${index}`}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
              <CalendarDays size={18} className="text-[#1f2a44]" />
              Venue Gallery
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {item.gallery.slice(0, 5).map((image, index) => (
                <div key={`${item.id}-gallery-${index}`} className="relative h-24 overflow-hidden rounded-[8px] border border-gray-200 bg-gray-100">
                  <Image src={image} alt={`${item.name} gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
              <button
                type="button"
                className="inline-flex h-24 items-center justify-center rounded-[8px] border border-dashed border-gray-300 bg-[#f8fafc] text-xs font-semibold text-gray-500 transition-colors hover:border-[#c49a22]/40 hover:text-[#c49a22]"
              >
                View More
              </button>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
              <Wrench size={18} className="text-[#1f2a44]" />
              Amenities &amp; Specifications
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.amenities.map((entry) => (
                <span key={entry} className="inline-flex items-center rounded-full bg-[#f5edcc] px-2.5 py-1 text-xs font-medium text-[#8c6c14]">
                  {entry}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
                <CalendarDays size={18} className="text-[#1f2a44]" />
                Upcoming Schedule
              </h2>
              <button type="button" className="w-full text-left text-xs font-semibold text-[#c49a22] hover:underline sm:w-auto sm:text-right">
                View Full Calendar
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {item.upcomingSchedule.map((schedule) => (
                <div
                  key={schedule.id}
                  className={cn(
                    "grid grid-cols-[56px_minmax(0,1fr)] items-start gap-3 rounded-[8px] border border-gray-100 bg-[#fbfcff] p-3 sm:flex sm:items-center",
                    schedule.status === "confirmed" ? "border-l-[3px] border-l-[#c49a22]" : "border-l-[3px] border-l-[#cbd5e1]"
                  )}
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[8px] bg-white">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-gray-500">{schedule.month}</span>
                    <span className="text-xl font-bold leading-none text-[#1f2a44]">{schedule.day}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-[#1f2a44] sm:truncate">{schedule.title}</p>
                    <p className="text-xs leading-relaxed text-gray-500">{schedule.timeRange} • Organized by {schedule.organizer}</p>
                  </div>

                  <span className={cn("col-span-2 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] sm:col-auto sm:ml-auto", scheduleStatusStyles[schedule.status])}>
                    {schedule.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[#1f2a44]">Location Map</h3>
            <div className="relative mt-3 h-40 overflow-hidden rounded-[8px] border border-gray-200 bg-gray-100">
              <Image src={item.mapImageUrl} alt="Venue location map" fill className="object-cover" />
            </div>
            <p className="mt-3 rounded-[8px] bg-[#f8fafc] px-2.5 py-2 text-xs text-gray-600">
              <span className="font-semibold text-[#8c6c14]">Getting there:</span> {item.gettingThere}
            </p>
          </article>

          <article className="rounded-[10px] border border-[#223264] bg-[#1f2a44] p-4 text-white shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d0b05b]">Venue Statistics</h3>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[8px] bg-white/8 p-3">
                <p className="text-[11px] text-white/70">Monthly Utilization</p>
                <p className="mt-1 text-3xl font-bold leading-none sm:text-[34px]">{item.venueStatistics.monthlyUtilization}</p>
              </div>
              <div className="rounded-[8px] bg-white/8 p-3">
                <p className="text-[11px] text-white/70">Events this month</p>
                <p className="mt-1 text-2xl font-bold leading-none sm:text-[30px]">{item.venueStatistics.eventsThisMonth}</p>
              </div>
              <div className="rounded-[8px] bg-white/8 p-3 sm:col-span-2 xl:col-span-1">
                <p className="text-[11px] text-white/70">Average rating</p>
                <p className="mt-1 inline-flex flex-wrap items-center gap-1 text-xl font-bold leading-none sm:text-2xl">
                  {item.venueStatistics.averageRating}
                  <Star size={14} className="text-[#d0b05b]" />
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Venue Contact</h3>
            <div className="mt-3">
              <p className="font-semibold text-[#1f2a44]">{item.contact.name}</p>
              <p className="text-xs text-gray-500">{item.contact.role}</p>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p className="inline-flex items-center gap-1.5">
                <Phone size={13} className="text-gray-400" />
                {item.contact.phone}
              </p>
              <p className="inline-flex items-center gap-1.5">
                <User size={13} className="text-gray-400" />
                {item.contact.email}
              </p>
            </div>
          </article>
        </aside>
      </section>

      <DashboardFooter />
    </div>
  );
}
