"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "@/components/ui/Badge";
import { announcementService } from "@/api/services/announcement.service";

dayjs.extend(relativeTime);
import { getPublicAnnouncementCategoryLabel, publicAnnouncementTabs } from "@/lib/public/announcements";
import type { AnnouncementItem, AnnouncementCategory } from "@/types/dashboard";

const PAGE_SIZE = 5;

function categoryLabel(category: AnnouncementCategory) {
  return getPublicAnnouncementCategoryLabel(category);
}

function getPublicAnnouncementSourceLabel(announcement: AnnouncementItem) {
  return announcement.authorName || "Official Notice";
}

function AnnouncementCard({ announcement }: { announcement: AnnouncementItem }) {
  return (
    <Link href={`/public/announcements/${announcement.id}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#eceff6] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(14,26,66,0.12)] cursor-pointer">
        <div className="relative h-40 bg-[#f2f4f8]">
          <Image
            src={announcement.imageUrl}
            alt={announcement.title}
            fill
            sizes="(max-width: 1280px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,63,0.08),rgba(4,18,63,0.18))]" />
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-[#0f1d49] shadow-sm">
            {categoryLabel(announcement.category)}
          </span>
          <span className="absolute right-3 top-3 text-[10px] font-medium uppercase tracking-[0.08em] text-white/90 drop-shadow-sm">
            {announcement.publishedAgo}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-[1.15rem] font-black leading-[1.12] text-[#0f1d49]">
            {announcement.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {announcement.body_excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
            <span className="flex flex-col gap-0.5">
              <span>{getPublicAnnouncementSourceLabel(announcement)}</span>
              {/* <span>Category: {categoryLabel(announcement.category)}</span> */}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#0f1d49]">
              Read More
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function AnnouncementCalloutCard() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-[#08143c] text-white shadow-sm">
      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f1c44d]">
          Announcement Desk
        </p>
        <h3 className="mt-5 text-3xl font-black leading-[1.08] sm:text-[2rem]">
          Need to publish a campus notice?
        </h3>
        <p className="mt-4 text-sm leading-7 text-[#c7d3f2]">
          Submit your announcement request and the communications team will review it for publication.
        </p>

        <button
          type="button"
          className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Submit Request
        </button>
      </div>
    </article>
  );
}

export function PublicAnnouncementsContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: announcementsResponse } = useQuery({
    queryKey: ["public-announcements"],
    queryFn: () => announcementService.getAnnouncements(1, 100),
    staleTime: 1000 * 60 * 2,
  });

  const announcements = useMemo(() => {
    if (announcementsResponse?.data) {
      return announcementsResponse.data.map((item) => ({
        id: item.id,
        title: item.title,
        body_excerpt: item.bodyExcerpt,
        imageUrl:
          item.image ||
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&auto=format&fit=crop",
        category: item.categoryDetails?.slug || "all",
        publishedAgo: dayjs(item.createdAt).fromNow(),
        authorName: item.authorName || item.authorRoleName || "Official Notice",
        isPinned: item.isPinned ?? false,
      }));
    }

    return [];
  }, [announcementsResponse]);

  const filteredAnnouncements = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesTab = activeTab === "all" || announcement.category === activeTab;
      const matchesQuery =
        normalized.length === 0 ||
        announcement.title.toLowerCase().includes(normalized) ||
        announcement.body_excerpt.toLowerCase().includes(normalized) ||
        getPublicAnnouncementSourceLabel(announcement).toLowerCase().includes(normalized);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, announcements, query]);

  const totalPages = Math.max(1, Math.ceil(filteredAnnouncements.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const visibleAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAnnouncements.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAnnouncements]);

  const pinnedAnnouncements = useMemo(
    () => announcements.filter((item) => item.isPinned),
    [announcements]
  );

  const heroAnnouncements = pinnedAnnouncements.length > 0 ? pinnedAnnouncements : null;
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (!heroAnnouncements || heroAnnouncements.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroAnnouncements.length);
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [heroAnnouncements]);

  const activeHeroIndex = heroAnnouncements ? heroIndex % heroAnnouncements.length : 0;
  const featuredAnnouncement = heroAnnouncements ? heroAnnouncements[activeHeroIndex] : null;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="space-y-7 sm:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b6861f]">
            Digital Billboard
          </p>
          <h1 className="mt-4 max-w-[12ch] text-4xl font-black leading-[0.96] text-[#08143c] sm:text-5xl lg:text-6xl">
            Campus Announcements
          </h1>
          <p className="mt-4 max-w-[62ch] text-base leading-8 text-slate-600">
            Your central repository for critical academic updates, student life bulletins, and university-wide communications.
          </p>
        </div>


      </section>

      {featuredAnnouncement ? (
        <article className="relative overflow-hidden rounded-[24px] bg-[#071741] text-white shadow-[0_22px_44px_rgba(8,20,60,0.24)]">
          <div className="relative flex min-h-[360px] flex-col justify-end sm:min-h-[400px]">
            <Image
              src={featuredAnnouncement.imageUrl}
              alt={featuredAnnouncement.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,63,0.92),rgba(4,18,63,0.18)_70%)]" />

            <div className="relative z-10 p-5 sm:p-7 lg:p-10">
              <div className="max-w-[720px]">
                <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85">
                  {featuredAnnouncement.isPinned ? <Badge variant="gold">Pinned</Badge> : null}
                  <span>{featuredAnnouncement.publishedAgo}</span>
                </div>
                <h2 className="mt-5 text-3xl font-black leading-[1.05] text-white sm:text-4xl lg:text-[3.15rem]">
                  {featuredAnnouncement.title}
                </h2>
                <p className="mt-4 max-w-[54ch] text-sm leading-7 text-[#c7d3f2] sm:text-base">
                  {featuredAnnouncement.body_excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-3 text-sm text-[#d7e1ff]">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
                      <CalendarClock size={15} className="text-[#f1c44d]" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">From</p>
                      <p className="font-semibold">{featuredAnnouncement.publishedAgo}</p>
                    </div>
                  </div>

                  <Link
                    href={`/public/announcements/${featuredAnnouncement.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f1c44d] transition-colors hover:text-[#ffd86e]"
                  >
                    Read Full Memo
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      ) : null}

      <section className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="relative block w-full xl:max-w-[520px]">
            <span className="sr-only">Filter announcements</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Filter by keywords (e.g. 'Scholarship', 'Cafeteria', 'Meeting')..."
              className="h-14 w-full rounded-[14px] border border-transparent bg-white pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#b6861f]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {publicAnnouncementTabs.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={
                    selected
                      ? "rounded-full bg-[#08143c] px-4 py-2.5 text-xs font-semibold text-white"
                      : "rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
          <AnnouncementCalloutCard />
        </div>

        {totalPages > 1 ? (
          <nav aria-label="Announcements pagination" className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {pageNumbers.map((pageNumber) => {
              const selected = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={
                    selected
                      ? "inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#08143c] text-sm font-semibold text-white"
                      : "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  }
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        ) : null}
      </section>
    </div>
  );
}
