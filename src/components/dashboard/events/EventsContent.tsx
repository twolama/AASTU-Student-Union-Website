"use client";

import { useMemo, useState, useEffect } from "react";
import { EventsFilters } from "@/components/dashboard/events/EventsFilters";
import { EventsStatsSection } from "@/components/dashboard/events/EventsStatsSection";
import { EventsTable } from "@/components/dashboard/events/EventsTable";
import { VenueOccupancyTrends } from "@/components/dashboard/events/VenueOccupancyTrends";
import { eventManagementStats, venueOccupancyTrends } from "@/data/dummy";
import { getAnalyticsDashboard } from "@/api/services/analytics.service";
import { useEvents } from "@/hooks/useEvents";
import type { EventManagementItem, VenueOccupancyPoint, StatsTrendPoint } from "@/types/dashboard";
import type { EventListItem } from "@/schemas/event.schema";
import { Loader2 } from "lucide-react";
import { formatEventDateParts, formatEventTimeRange } from "@/lib/events/datetime";

type EventDistributionItem = {
  id: string;
  value: number;
};

type OccupancyItem = {
  label: string;
  value: number;
};

type EventsAnalyticsPayload = {
  event_distribution?: EventDistributionItem[];
  eventDistribution?: EventDistributionItem[];
  occupancy_trends?: OccupancyItem[];
  occupancyTrends?: OccupancyItem[];
};

const ITEMS_PER_PAGE = 4;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

function formatEventRow(item: any): EventManagementItem {
  const { day, month } = formatEventDateParts(item.start_date_time);
  const scheduleDate = day !== "--" ? `${month} ${day}` : "TBD";
  const scheduleTime = formatEventTimeRange(item.start_date_time, item.end_date_time);
  const status = item.effectiveStatus || item.status || "upcoming";

  return {
    id: item.id,
    title: item.title,
    organizingClub: item.organizing_club?.name || "Student Union",
    venue: item.venue || "Campus Venue",
    scheduleDate,
    scheduleTime,
    status,
  };
}

export function EventsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useEvents(
    currentPage,
    ITEMS_PER_PAGE,
    {
      status: selectedStatus === "all" ? undefined : selectedStatus,
      clubId: selectedClub === "all" ? undefined : selectedClub,
      search: debouncedSearch || undefined,
      venue: selectedVenue === "all" ? undefined : selectedVenue
    }
  );

  const events = data?.data ?? [];
  const totalPagesFromServer = data?.meta?.totalPages ?? 1;
  const totalCountFromServer = data?.meta?.total ?? 0;

  const clubOptions = useMemo(() => {
    const clubs = events
      .map((event: EventListItem) => ({ value: event.organizing_club?.id || "unknown", label: event.organizing_club?.name || "Unknown Club" }))
      .filter((item: { value: string; label: string }, index: number, list: { value: string; label: string }[]) => list.findIndex((entry) => entry.value === item.value) === index);

    const options = [{ value: "all", label: "All Clubs" }, ...clubs];

    if (selectedClub !== "all" && !options.some((option) => option.value === selectedClub)) {
      options.push({ value: selectedClub, label: "Selected Club" });
    }

    return options;
  }, [events, selectedClub]);

  const venueOptions = useMemo(() => {
    const venues = events
      .map((event: EventListItem) => ({ value: event.venue || "unknown", label: event.venue || "Unknown Venue" }))
      .filter((item: { value: string; label: string }, index: number, list: { value: string; label: string }[]) => list.findIndex((entry) => entry.value === item.value) === index);

    const options = [{ value: "all", label: "All Venues" }, ...venues];

    if (selectedVenue !== "all" && !options.some((option) => option.value === selectedVenue)) {
      options.push({ value: selectedVenue, label: "Selected Venue" });
    }

    return options;
  }, [events, selectedVenue]);

  const paginatedItems = useMemo(() => {
    return events.map(formatEventRow);
  }, [events]);

  const totalPages = totalPagesFromServer;
  const totalCount = totalCountFromServer;
  const clampedPage = Math.min(currentPage, totalPages);

  const [liveEventStats, setLiveEventStats] = useState<typeof eventManagementStats | null>(null);
  const [liveVenueOccupancy, setLiveVenueOccupancy] = useState<Array<VenueOccupancyPoint | StatsTrendPoint> | null>(null);

  useEffect(() => {
    let mounted = true;
    getAnalyticsDashboard("last-8-months")
      .then((res) => {
        if (!mounted) return;
        if (res?.forbidden || !res?.data) return;
        const data: EventsAnalyticsPayload = typeof res.data === "object" && res.data !== null ? (res.data as EventsAnalyticsPayload) : {};
        const distribution = data.event_distribution || data.eventDistribution || [];
        const occupancy = data.occupancy_trends || data.occupancyTrends || [];

        const totalEvents = distribution.reduce((s: number, it: any) => s + (it.value || 0), 0);
        const mega = (distribution.find((d: any) => d.id === 'mega') || { value: 0 }).value || 0;

        const lastOcc = occupancy[occupancy.length - 1]?.value ?? 0;
        const prevOcc = occupancy[occupancy.length - 2]?.value ?? 0;
        const occDelta = Number((lastOcc - prevOcc).toFixed(1));

        const totalEventsPrev = 0; // fallback if not available
        const totalEventsDelta = 0; // cannot compute without event_trends; keep 0

        setLiveEventStats([
          { id: 'total-events', title: 'Total Events', value: String(totalEvents), trend: `${totalEventsDelta >= 0 ? '+' : ''}${totalEventsDelta}% vs last month`, icon: 'CalendarDays' },
          { id: 'mega-events', title: 'Mega Events', value: String(mega), trend: 'Priority Tier', icon: 'BadgeCheck' },
          { id: 'venue-utilization', title: 'Venue Utilization', value: `${lastOcc}%`, trend: `${occDelta >= 0 ? '+' : ''}${occDelta}% efficiency`, icon: 'MapPin' },
        ]);
        if (Array.isArray(occupancy) && occupancy.length > 0) {
          // occupancy is expected as [{ label, value }, ...]
          setLiveVenueOccupancy(occupancy.map((it: any) => ({ label: it.label, value: Number(it.value) })));
        }
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5">
      <EventsStatsSection items={liveEventStats ?? eventManagementStats} />

      <EventsFilters
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        selectedClub={selectedClub}
        onSelectedClubChange={(value) => {
          setSelectedClub(value);
          setCurrentPage(1);
        }}
        selectedVenue={selectedVenue}
        onSelectedVenueChange={(value) => {
          setSelectedVenue(value);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={(value) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}
        clubOptions={clubOptions}
        venueOptions={venueOptions}
      />

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[12px] border border-gray-200 bg-white shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
          <p className="text-sm text-gray-500">Fetching events...</p>
        </div>
      ) : (
        <EventsTable
          items={paginatedItems}
          currentPage={clampedPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={totalCount}
        />
      )}

      <VenueOccupancyTrends points={liveVenueOccupancy ?? venueOccupancyTrends} />
    </div>
  );
}
