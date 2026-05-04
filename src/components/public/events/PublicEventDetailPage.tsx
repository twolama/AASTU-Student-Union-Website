"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Users2,
  UserRound,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { useEvent, useEvents } from "@/hooks/useEvents";
import dayjs from "dayjs";

type PublicVenueDetails = {
  name?: string;
  location?: string;
  campus_block?: string;
  floor_level?: string;
  nearby_landmarks?: string;
  short_description?: string;
  full_description?: string;
  google_maps_url?: string;
  hero_image?: string | null;
  thumbnail?: string | null;
  image_url?: string | null;
  map_coordinates?: { lat?: number | null; lng?: number | null } | null;
  gallery?: Array<{
    id?: string;
    image?: string | null;
    image_url?: string | null;
    url?: string | null;
    alt_text?: string | null;
  }>;
};

function resolveMediaUrl(value?: string | null) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/api/proxy/")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `/api/proxy${value}`;
  }

  return `/api/proxy/${value}`;
}

function extractGoogleMapsCoordinates(url?: string | null) {
  if (!url) {
    return null;
  }

  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        lat: Number.parseFloat(match[1]),
        lng: Number.parseFloat(match[2]),
      };
    }
  }

  return null;
}

interface PublicEventDetailPageProps {
  eventId: string;
}

function formatVenueLocationLabel(venue?: PublicVenueDetails | null, fallback?: string) {
  if (!venue) {
    return fallback || "AASTU Campus";
  }

  const locationParts = [
    venue.location,
    venue.campus_block ? `Block ${venue.campus_block}` : "",
    venue.floor_level ? `Floor ${venue.floor_level}` : "",
  ].filter(Boolean);

  if (locationParts.length > 0) {
    return locationParts.join(" · ");
  }

  return fallback || venue.name || "AASTU Campus";
}

function getVenueMapEmbedUrl(venue?: PublicVenueDetails | null, locationLabel?: string) {
  const parsedCoordinates = extractGoogleMapsCoordinates(venue?.google_maps_url);
  const coordinates = venue?.map_coordinates ?? parsedCoordinates;

  if (coordinates?.lat != null && coordinates?.lng != null) {
    return `https://www.google.com/maps/@${coordinates.lat},${coordinates.lng},18z/data=!3m1!1e3?output=embed`;
  }

  if (venue?.google_maps_url) {
    if (venue.google_maps_url.includes("/embed")) {
      return venue.google_maps_url;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(locationLabel || venue.name || "AASTU Campus")}&t=k&z=18&output=embed`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(locationLabel || venue?.name || "AASTU Campus")}&output=embed`;
}

function getVenueGallery(venue?: PublicVenueDetails | null) {
  const galleryImages = (venue?.gallery || [])
    .map((image) => resolveMediaUrl(image.image_url || image.url || image.image || ""))
    .filter(Boolean);

  const fallbackImages = [
    resolveMediaUrl(venue?.hero_image),
    resolveMediaUrl(venue?.thumbnail),
    resolveMediaUrl(venue?.image_url),
  ].filter(Boolean);

  return Array.from(new Set([...galleryImages, ...fallbackImages]));
}

function getBookingTimeLabel(bookingDetails?: { time_label?: string | null; selected_slots?: string[] | null; time_range?: string | null } | null) {
  if (!bookingDetails) {
    return null;
  }

  if (bookingDetails.time_label) {
    return bookingDetails.time_label;
  }

  if (bookingDetails.time_range) {
    return bookingDetails.time_range;
  }

  if (bookingDetails.selected_slots && bookingDetails.selected_slots.length > 0) {
    const sortedSlots = [...bookingDetails.selected_slots].sort();

    const format12h = (slot: string) => {
      const [hours, minutes = "00"] = slot.split(":");
      const hourNumber = Number.parseInt(hours, 10);
      if (Number.isNaN(hourNumber)) return slot;
      const suffix = hourNumber >= 12 ? "PM" : "AM";
      const normalizedHour = hourNumber % 12 === 0 ? 12 : hourNumber % 12;
      return minutes === "00" ? `${normalizedHour} ${suffix}` : `${normalizedHour}:${minutes} ${suffix}`;
    };

    if (sortedSlots.length === 1) {
      return format12h(sortedSlots[0]);
    }

    return `${format12h(sortedSlots[0])} - ${format12h(sortedSlots[sortedSlots.length - 1])}`;
  }

  return null;
}

export function PublicEventDetailPage({ eventId }: PublicEventDetailPageProps) {
  const { data: event, isLoading, isError, error } = useEvent(eventId);
  const { data: relatedResponse } = useEvents(1, 4);
  const venue = event?.venue_details as PublicVenueDetails | undefined;
  const bookingDetails = (event as typeof event & { booking_details?: { time_label?: string | null; time_range?: string | null; selected_slots?: string[] | null; date_label?: string | null } | null })?.booking_details;

  const relatedEvents = relatedResponse?.data
    ? relatedResponse.data.filter((e) => e.id !== eventId).slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <PublicHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#b6861f]" />
        </div>
        <PublicFooter />
      </main>
    );
  }

  if (isError || !event) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <PublicHeader />
        <div className="mx-auto max-w-[1280px] px-4 py-20 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-3xl font-black text-[#0f1d49]">Event Not Found</h2>
          <p className="mt-2 text-slate-600">The event you are looking for might have been moved or deleted.</p>
          <Link
            href="/public/events"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#08143c] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#14213d]"
          >
            Back to Events
          </Link>
        </div>
        <PublicFooter />
      </main>
    );
  }

  const dateLabel = event.start_date_time ? dayjs(event.start_date_time).format("MMMM DD, YYYY") : "Date TBD";
  const bookingTimeLabel = getBookingTimeLabel(bookingDetails);
  const timeLabel = bookingTimeLabel || (event.start_date_time && event.end_date_time && !dayjs(event.start_date_time).isSame(dayjs(event.end_date_time))
    ? `${dayjs(event.start_date_time).format("hh:mm A")} - ${dayjs(event.end_date_time).format("hh:mm A")}`
    : "Time TBD");

  // Find coordinator from volunteers if available
  const coordinator = event.volunteers?.find(v => v.role?.toLowerCase() === "host" || v.role?.toLowerCase() === "coordinator")?.full_name 
    || "Student Union Coordinator";
  const venueLocationLabel = formatVenueLocationLabel(venue, event.physical_location_details || event.venue || "AASTU Campus");
  const venueGallery = getVenueGallery(venue);
  const venueMapEmbedUrl = getVenueMapEmbedUrl(venue, venueLocationLabel);
  const venueHeroImage = resolveMediaUrl(venue?.hero_image || venue?.thumbnail || venue?.image_url || event.cover_image) || "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200";

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="w-full bg-[#020e34]">
        <article className="relative overflow-hidden text-white">
          <div className="relative h-[230px] sm:h-[260px] lg:h-[300px]">
            <Image
              src={event.cover_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800"}
              alt={event.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,63,0.9),rgba(4,18,63,0.24)_66%)]" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto w-full max-w-[1280px] p-4 sm:p-5 lg:p-6">
                <div className="max-w-[920px]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {event.is_mega_event && (
                      <span className="rounded-full bg-[#f1c44d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#08143c]">
                        Mega Event
                      </span>
                    )}
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                      {event.organizing_club.category_name || "General"}
                    </span>
                  </div>

                  <h1 className="mt-3 text-3xl font-black leading-[1.05] text-white sm:text-4xl lg:text-5xl">
                    {event.title}
                  </h1>

                  <div className="mt-3 grid gap-3 text-xs text-[#d7e1ff] sm:grid-cols-2 sm:text-sm lg:grid-cols-3">
                    <p className="inline-flex items-center gap-2.5">
                      <CalendarDays size={15} className="text-[#f1c44d]" />
                      {dateLabel}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <Clock3 size={15} className="text-[#f1c44d]" />
                      {timeLabel}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <MapPin size={15} className="text-[#f1c44d]" />
                      {event.venue || "TBA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <article>
              <h2 className="text-4xl font-black leading-tight text-[#0f1d49]">About the Event</h2>
              <div 
                className="mt-4 text-[1.05rem] leading-9 text-slate-600 prose prose-slate max-w-none prose-p:leading-9 prose-p:mt-0 prose-p:mb-5"
                dangerouslySetInnerHTML={{ __html: event.description || event.short_description || "No description provided." }}
              />

              <blockquote className="mt-6 rounded-[12px] border-l-4 border-[#d2ab42] bg-[#edf0f5] px-5 py-5 text-lg leading-8 text-[#1f2b4e]">
                &quot;The summit represents the spirit of AASTU: where curiosity meets practical engineering and students lead meaningful change.&quot;
              </blockquote>
            </article>

            <article className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-4xl font-black leading-tight text-[#0f1d49]">Venue &amp; Location</h2>
                {venue?.google_maps_url ? (
                  <a
                    href={venue.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#f8f3e1] px-3 py-1 text-xs font-semibold text-[#8c6c14] transition-colors hover:bg-[#f3e7bf]"
                  >
                    Open Maps
                    <ArrowRight size={12} />
                  </a>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-slate-100">
                  <div className="relative h-[280px]">
                    <iframe
                      title={`${event.title} venue map`}
                      src={venueMapEmbedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="overflow-hidden rounded-[14px] bg-[#f8fafc]">
                    <div className="relative h-40">
                      <Image src={venueHeroImage} alt={event.venue || "Venue"} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
                    </div>
                  </div>

                  <div className="rounded-[14px] bg-[#f8fafc] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Venue Name</p>
                    <p className="mt-1 text-lg font-semibold text-[#0f1d49]">{venue?.name || event.venue || "Venue TBA"}</p>
                    <p className="mt-1">{venueLocationLabel}</p>
                  </div>

                  <div className="rounded-[14px] bg-[#f8fafc] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Nearby Landmarks</p>
                    <p className="mt-1">{venue?.nearby_landmarks || event.physical_location_details || "AASTU Campus"}</p>
                  </div>

                  {(venue?.short_description || venue?.full_description) ? (
                    <div className="rounded-[14px] bg-[#f8fafc] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Venue Notes</p>
                      <p className="mt-1 leading-7">{venue?.short_description || venue?.full_description}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>

            <article className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-4xl font-black leading-tight text-[#0f1d49]">Venue Gallery</h2>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{venueGallery.length} photos</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {venueGallery.map((image, index) => (
                  <div key={`${event.id}-venue-gallery-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-slate-100">
                    <Image src={image} alt={`${event.title} venue gallery ${index + 1}`} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                ))}
                {venueGallery.length === 0 ? (
                  <div className="rounded-[12px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                    Venue photos are not available for this event yet.
                  </div>
                ) : null}
              </div>
            </article>

            {event.logistics && event.logistics.length > 0 && (
              <article>
                <h2 className="text-4xl font-black leading-tight text-[#0f1d49]">Event Logistics</h2>
                <div className="mt-4 space-y-3">
                  {event.logistics.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-[12px] bg-white px-4 py-4 shadow-sm sm:flex sm:items-start sm:gap-6"
                    >
                      <p className="text-sm font-bold text-[#0f1d49] sm:min-w-[82px]">{item.venue || "Venue"}</p>
                      <div className="mt-1 sm:mt-0">
                        <p className="text-lg font-bold text-[#0f1d49]">{item.equipment || "Resources"}</p>
                        {item.selectedAmenities && item.selectedAmenities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.selectedAmenities.map((amenity: string, aidx: number) => (
                              <span key={aidx} className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </div>

          <aside className="space-y-5">
            <article className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-3xl font-black text-[#0f1d49]">Event Details</h3>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Organization
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 font-semibold text-[#0f1d49]">
                    <Users2 size={15} className="text-[#b6861f]" />
                    {event.organizing_club.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Capacity
                  </p>
                  <p className="mt-1 font-semibold text-[#0f1d49]">{event.attendance?.current || 0} / {event.max_capacity || "Unlimited"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Coordinator
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 font-semibold text-[#0f1d49]">
                    <UserRound size={15} className="text-[#b6861f]" />
                    {coordinator}
                  </p>
                </div>
              </div>

              {event.registration_link && (
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#f1c44d] text-sm font-semibold text-[#0d1a45] transition-colors hover:bg-[#ffd668]"
                >
                  Register Now
                </a>
              )}

              <button
                type="button"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#eceff5] text-sm font-semibold text-[#0f1d49] transition-colors hover:bg-[#e1e6f0]"
              >
                Inquiry & Support
              </button>
            </article>

            <article className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-3xl font-black text-[#0f1d49]">Venue</h3>

              <div className="mt-4 overflow-hidden rounded-[10px] bg-[#eff2f8]">
                <div className="relative h-[150px]">
                  <Image
                    src={venueHeroImage}
                    alt={venue?.name || event.venue || "Venue"}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-[#0f1d49]">{venue?.name || event.venue || "Venue TBA"}</p>
              <p className="mt-1 text-xs text-slate-500">{venueLocationLabel}</p>

              {venue?.google_maps_url ? (
                <Link
                  href={venue.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#b6861f] transition-colors hover:text-[#9f7418]"
                >
                  Get Directions
                  <ArrowRight size={13} />
                </Link>
              ) : null}
            </article>
          </aside>
        </div>

        <section className="rounded-[16px] bg-[#eef1f7] p-5 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b6861f]">Discovery</p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-[#0f1d49]">Other Events</h2>
            </div>

            <Link
              href="/public/events"
              className="text-sm font-semibold text-[#0f1d49] underline decoration-slate-400 underline-offset-4 transition-colors hover:text-[#b6861f]"
            >
              View All Events
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedEvents.map((e) => (
              <article key={e.id} className="overflow-hidden rounded-[14px] bg-white shadow-sm">
                <div className="relative h-40">
                  <Image
                    src={e.cover_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"}
                    alt={e.title}
                    fill
                    sizes="(max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-[#0f1d49]">
                    {e.organizing_club.category_name || "General"}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {e.date_month || (e.start_date_time ? dayjs(e.start_date_time).format("MMM") : "???")} {e.date_day || (e.start_date_time ? dayjs(e.start_date_time).format("DD") : "??")}{e.start_date_time ? `, ${dayjs(e.start_date_time).format("YYYY")}` : ''}
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-[#0f1d49] line-clamp-1">{e.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-1">{e.venue || "TBA"}</p>

                  <Link
                    href={`/public/events/${e.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1d49] transition-colors hover:text-[#b6861f]"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <PublicFooter />
    </main>
  );
}
