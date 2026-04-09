import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Copy,
  ExternalLink,
  Layers3,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { cn } from "@/lib/utils";
import type { BookingDetailItem } from "@/types/dashboard";

interface BookingDetailViewProps {
  item: BookingDetailItem;
}

export function BookingDetailView({ item }: BookingDetailViewProps) {
  const heroGallery = item.gallery.slice(1, 4);
  const [firstPreview, secondPreview, thirdPreview] = heroGallery;

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/bookings" className="text-gray-500 hover:text-gray-700">
          Bookings
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{item.venueIdLabel}</span>
      </nav>

      <section className="space-y-3 rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="success" className="bg-emerald-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-emerald-700">
            {item.availabilityLabel}
          </Badge>
          <span className="text-[#8a95a8]">Venue ID: {item.venueIdLabel}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#1f2a44]">{item.title}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#6d7a95]">{item.subtitle}</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button type="button" variant="outline" className="h-9 w-full sm:w-auto">
              <Share2 size={14} />
              Share Venue
            </Button>
            <Link href={`/bookings/new?venueId=${item.venueSelectionId}`} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:w-auto">
              <CalendarDays size={14} />
              Book Venue
            </Link>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative h-72 overflow-hidden rounded-[12px] border border-gray-200 bg-gray-100 sm:h-[420px] md:h-full md:min-h-[420px]">
            <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover" />
          </div>

          <div className="grid grid-cols-3 gap-2 md:hidden">
            {heroGallery.map((image, index) => (
              <div key={`${item.id}-mobile-gallery-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-gray-200 bg-gray-100">
                <Image src={image} alt={`${item.title} gallery ${index + 1}`} fill className="object-cover" />
                {index === heroGallery.length - 1 ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-semibold text-white">
                    +12
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="hidden gap-2 md:grid md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="grid grid-cols-2 gap-2">
              {[firstPreview, secondPreview].filter(Boolean).map((image, index) => (
                <div key={`${item.id}-desktop-top-${index}`} className="relative h-full min-h-[132px] overflow-hidden rounded-[12px] border border-gray-200 bg-gray-100">
                  <Image src={image} alt={`${item.title} gallery top ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {thirdPreview ? (
              <div className="relative min-h-[160px] overflow-hidden rounded-[12px] border border-gray-200 bg-gray-100 lg:min-h-[204px]">
                <Image src={thirdPreview} alt={`${item.title} gallery featured`} fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white">
                  +12 Photos
                </div>
              </div>
            ) : (
              <div className="min-h-[160px] rounded-[12px] border border-dashed border-gray-300 bg-[#f8fafc] lg:min-h-[204px]" />
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_255px]">
        <div className="space-y-4">
          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-2xl font-bold text-[#1f2a44]">About the Venue</h2>
            <div className="mt-3 space-y-4 text-sm leading-7 text-[#5f6f8d]">
              {item.aboutParagraphs.map((paragraph, index) => (
                <p key={`${item.id}-about-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-[10px] border border-gray-200 bg-[#fbfcff] px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Capacity</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f2a44]">
                  <Users size={13} className="text-[#b48a1b]" />
                  {item.capacityLabel}
                </p>
              </div>

              <div className="rounded-[10px] border border-gray-200 bg-[#fbfcff] px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Level</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f2a44]">
                  <Layers3 size={13} className="text-[#b48a1b]" />
                  {item.levelLabel}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-2xl font-bold text-[#1f2a44]">Key Amenities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.amenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center rounded-full border border-gray-200 bg-[#f3f6fb] px-3 py-1.5 text-xs text-[#4f5f7c]">
                  {amenity}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-2xl font-bold text-[#1f2a44]">Location</h2>

            <div className="mt-4 overflow-hidden rounded-[10px] border border-gray-200">
              <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-[#fbfcff] p-3">
                <div>
                  <p className="font-semibold text-[#1f2a44]">{item.locationTitle}</p>
                  <p className="mt-1 text-sm text-[#6d7a95]">{item.locationAddress}</p>
                </div>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1f2a44] hover:bg-gray-50"
                >
                  <MapPin size={12} />
                  Get Directions
                </a>
              </div>

              <div className="relative h-44 bg-gray-100 sm:h-52">
                <Image src={item.locationMapImageUrl} alt="Venue location" fill className="object-cover" />
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold text-[#1f2a44]">Availability</h3>
              <span className="text-xs text-[#8a95a8]">{item.availabilityMonthLabel}</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <div className="min-w-[210px]">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {item.availabilityDays.slice(0, 7).map((day, index) => (
                    <p key={`${day.dayLabel}-head-${index}`} className="text-[10px] font-semibold text-[#a0abc0]">
                      {day.dayLabel}
                    </p>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1 text-center">
                  {item.availabilityDays.map((day, index) => (
                    <span
                      key={`${day.dayLabel}-${day.date}-${index}`}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-semibold",
                        day.active && "bg-[#f3e6be] text-[#8c6c14]",
                        day.busy && "bg-rose-100 text-rose-600",
                        !day.active && !day.busy && "bg-[#f4f6fa] text-[#7d8aa4]"
                      )}
                    >
                      {day.date}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a95a8]">Upcoming Events</p>
              <div className="mt-2 space-y-2.5">
                {item.upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-[8px] bg-[#fbfcff] px-2.5 py-2">
                    <p className="text-[11px] font-medium text-[#8c6c14]">{event.dateLabel} · {event.timeLabel}</p>
                    <p className="text-xs font-semibold text-[#1f2a44]">{event.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[12px] border border-[#3a2f12] bg-[#221d12] p-4 text-white shadow-sm">
            <h3 className="text-2xl font-semibold">Need assistance?</h3>
            <p className="mt-2 text-sm text-white/75">
              Our technical team is available to help with equipment setup and coordination.
            </p>
            <button type="button" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#d8b861] hover:underline">
              Contact Facility Manager
              <ExternalLink size={13} />
            </button>
          </article>
        </aside>
      </section>

      <section className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-[#1f2a44]">Similar Venues</h2>
          <Link href="/bookings" className="text-sm font-semibold text-[#b48a1b] hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {item.similarVenues.map((venue) => (
            <article key={venue.id} className="overflow-hidden rounded-[10px] border border-gray-200">
              <div className="relative h-28 bg-gray-100">
                <Image src={venue.imageUrl} alt={venue.name} fill className="object-cover" />
                <Badge variant="default" className="absolute left-2 top-2 bg-white/90 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#1f2a44]">
                  {venue.tag}
                </Badge>
              </div>

              <div className="space-y-1 p-3">
                <p className="font-semibold text-[#1f2a44]">{venue.name}</p>
                <p className="text-xs text-[#78839b]">{venue.capacity.toLocaleString()} capacity · {venue.location}</p>
                <Link href={`/bookings/${venue.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#b48a1b] hover:underline">
                  Open Details
                  <Copy size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <DashboardFooter />
    </div>
  );
}
