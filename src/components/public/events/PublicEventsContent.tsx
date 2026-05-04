/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, MapPin, Search, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { publicEventCategories,} from "@/lib/public/events";
import { useEvents } from "@/hooks/useEvents";
import { usePermissions } from "@/hooks/usePermissions";
import type { EventListItem } from "@/schemas/event.schema";
import dayjs from "dayjs";

const PAGE_SIZE = 5;

function getCategoryName(event: EventListItem) {
  const organizingClub = event.organizing_club as
    | (EventListItem["organizing_club"] & {
        categoryName?: string;
        category_details?: { name?: string };
      })
    | undefined;

  return (
    organizingClub?.category_name ||
    organizingClub?.categoryName ||
    organizingClub?.category_details?.name ||
    "General"
  );
}

function excerpt(text?: string, length = 120) {
  if (!text) return "";
  return text.length <= length ? text : `${text.slice(0, length).trimEnd()}...`;
}

function EventCard({ event }: { event: EventListItem }) {
  const router = useRouter();
  const dateDay = event.date_day || (event.start_date_time ? dayjs(event.start_date_time).format("DD") : "??");
  const dateMonth = event.date_month || (event.start_date_time ? dayjs(event.start_date_time).format("MMM") : "???");
  
  const timeRange = event.start_date_time && event.end_date_time 
    ? `${dayjs(event.start_date_time).format("hh:mm A")} - ${dayjs(event.end_date_time).format("hh:mm A")}`
    : "Time TBD";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/public/events/${event.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/public/events/${event.id}`); }}
      className="group cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(14,26,66,0.12)]"
    >
      <div className="relative h-36 overflow-hidden sm:h-44">
        <Image
          src={event.cover_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute left-4 top-4 flex h-12 w-12 flex-col items-center justify-center rounded-[10px] bg-white text-[#14213d] shadow-sm">
          <span className="text-xl font-black leading-none">{dateDay}</span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            {dateMonth}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b6861f]">
          {getCategoryName(event)}
        </p>
        <h3 className="mt-3 text-[1.4rem] font-black leading-[1.2] text-[#0f1d49] sm:text-[1.55rem] line-clamp-2 min-h-[3rem]">
          {event.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2 min-h-[3rem]">
          {excerpt(event.short_description || event.title, 140)}
        </p>

        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p className="inline-flex items-center gap-2">
            <MapPin size={14} />
            <span className="line-clamp-1">{event.venue || "TBA"}</span>
          </p>
          <p className="inline-flex items-center gap-2">
            <Clock3 size={14} />
            <span>{timeRange}</span>
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {event.registration_link ? (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#f1c44d] px-4 py-2 text-sm font-semibold text-[#0d1a45] transition-colors hover:bg-[#ffd668]"
            >
              Register
            </a>
          ) : (
            <span className="text-sm font-medium text-slate-500">&nbsp;</span>
          )}

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1d49] transition-colors group-hover:text-[#b6861f]">
            Details
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

function ProposalCard() {
  return (
    <article className="rounded-[20px] bg-[#031343] p-7 text-white shadow-sm sm:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f1c44d]">
        Organization
      </p>
      <h3 className="mt-4 text-4xl font-black leading-[1.04] sm:text-[2.7rem]">
        Host Your Own Event
      </h3>
      <p className="mt-4 max-w-[28ch] text-sm leading-7 text-[#c4d0ee] sm:text-base">
        Are you a club lead or project manager?
      </p>
      <p className="mt-4 max-w-[34ch] text-sm leading-7 text-[#c4d0ee] sm:text-base">
        Submit your event proposal to the Student Union for official recognition and resource allocation.
      </p>

      <button
        type="button"
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[11px] border border-white/25 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        Submit Proposal
      </button>
    </article>
  );
}

export function PublicEventsContent() {
  const [activeCategory, setActiveCategory] = useState<(typeof publicEventCategories)[number]>("All Events");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { hasPermission } = usePermissions();
  const canRegisterForEvents = hasPermission("events.create");

  const { data: eventsResponse, isLoading, isError } = useEvents(page, PAGE_SIZE);

  const filteredEvents = useMemo(() => {
    if (!eventsResponse?.data) return [];
    
    const normalized = query.trim().toLowerCase();

    return eventsResponse.data.filter((event) => {
      const categoryMatches =
        activeCategory === "All Events" ||
        (getCategoryName(event).toLowerCase() === activeCategory.toLowerCase());

      const queryMatches =
        normalized.length === 0 ||
        event.title.toLowerCase().includes(normalized) ||
        (event.venue?.toLowerCase().includes(normalized) ?? false) ||
        getCategoryName(event).toLowerCase().includes(normalized);

      return categoryMatches && queryMatches;
    });
  }, [activeCategory, query, eventsResponse]);

  const totalPages = eventsResponse?.meta?.totalPages || 1;

  // Reset to first page when category or query changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory, query]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  // Find a mega event for the hero section
  const megaEvent = useMemo(() => {
    return eventsResponse?.data?.find(e => e.is_mega_event);
  }, [eventsResponse]);

  return (
    <div className="space-y-7 sm:space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b6861f]">
          Institutional Calendar
        </p>
        <h1 className="mt-4 max-w-[14ch] text-4xl font-black leading-[0.96] text-[#08143c] sm:text-5xl lg:text-6xl">
          Upcoming Events
        </h1>
        <p className="mt-4 max-w-[72ch] text-base leading-8 text-slate-600">
          Discover the next generation of academic excellence through our curated series of workshops, galas, and innovation summits.
        </p>
      </section>

      {megaEvent ? (
        <section className="relative overflow-hidden rounded-[28px] bg-[#020d2f] text-white shadow-[0_22px_44px_rgba(8,20,60,0.24)]">
          <div className="relative flex flex-col justify-end min-h-[400px]">
            <Image
              src={megaEvent.cover_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800"}
              alt={megaEvent.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,63,0.85),rgba(4,18,63,0.2)_65%)]" />

            <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-10">
              <div className="max-w-[640px]">
                <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-white/90">
                  <span className="rounded-full bg-[#f1c44d] px-2.5 py-1 text-[10px] font-bold text-[#08143c]">
                    MEGA EVENT
                  </span>
                  {megaEvent.start_date_time ? dayjs(megaEvent.start_date_time).format("MMMM DD, YYYY | hh:mm A") : ""}
                </p>

                <h2 className="mt-4 text-[2.2rem] font-black leading-[0.98] sm:text-[3rem] lg:text-[4rem]">
                  {megaEvent.title}
                </h2>
                <p className="mt-4 max-w-[58ch] text-sm leading-7 text-[#c7d3f2] sm:text-base line-clamp-2">
                  {megaEvent.short_description || megaEvent.title}
                </p>
              </div>

              {megaEvent.registration_link ? (
                <a
                  href={megaEvent.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-[12px] bg-[#f1c44d] px-8 text-sm font-semibold text-[#0d1a45] transition-colors hover:bg-[#ffd668]"
                >
                  Register Now
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2.5">
            {publicEventCategories.map((category) => {
              const selected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    selected
                      ? "rounded-full bg-[#08143c] px-5 py-2.5 text-xs font-semibold text-white"
                      : "rounded-full bg-[#eef0f5] px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#e4e8f2]"
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full max-w-[360px]">
            <span className="sr-only">Search events</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events..."
              className="h-11 w-full rounded-full border border-transparent bg-[#eceff5] pl-11 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#b6861f]"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#b6861f]" />
          </div>
        ) : isError ? (
          <div className="rounded-[14px] border border-dashed border-red-300 bg-red-50 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-red-800">Failed to load events</p>
            <p className="mt-2 text-sm text-red-600">Please try again later.</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {canRegisterForEvents ? <ProposalCard /> : null}
          </div>
        ) : (
          <div className="rounded-[14px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#14213d]">No events match your filters</p>
            <p className="mt-2 text-sm text-slate-500">Try another category or clear your search text.</p>
          </div>
        )}

        {totalPages > 1 ? (
          <nav
            aria-label="Events pagination"
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eceff5] text-slate-600 transition-colors hover:bg-[#dfe4ee] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {pageNumbers.map((pageNumber) => {
              const selected = pageNumber === page;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={
                    selected
                      ? "inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#08143c] text-sm font-semibold text-white"
                      : "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-slate-600 transition-colors hover:bg-[#e8ebf2]"
                  }
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              aria-label="Next page"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eceff5] text-slate-600 transition-colors hover:bg-[#dfe4ee] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        ) : null}
      </section>
    </div>
  );
}
