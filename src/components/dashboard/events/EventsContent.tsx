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

const ITEMS_PER_PAGE = 4;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

function formatEventRow(item: any): EventManagementItem {
  const scheduleDate = item.date_month && item.date_day ? `${item.date_month} ${item.date_day}` : "TBD";
  const scheduleTime = item.start_date_time && item.end_date_time ? `${new Date(item.start_date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(item.end_date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "TBD";
  const status = item.status === "live-now" || item.status === "upcoming" || item.status === "archived" ? item.status : item.status || "upcoming";

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

  const { data } = useEvents(
    currentPage,
    ITEMS_PER_PAGE,
    selectedStatus === "all" ? undefined : selectedStatus,
    selectedClub === "all" ? undefined : selectedClub
  );

  const events = data?.data ?? [];
  const totalPagesFromServer = data?.meta?.totalPages ?? 1;
  const totalCountFromServer = data?.meta?.total ?? 0;

  const clubOptions = useMemo(() => {
    const clubs = events
      .map((event) => ({ value: event.organizing_club?.id || "unknown", label: event.organizing_club?.name || "Unknown Club" }))
      .filter((item, index, list) => list.findIndex((entry) => entry.value === item.value) === index);

    const options = [{ value: "all", label: "All Clubs" }, ...clubs];

    if (selectedClub !== "all" && !options.some((option) => option.value === selectedClub)) {
      options.push({ value: selectedClub, label: "Selected Club" });
    }

    return options;
  }, [events, selectedClub]);

  const venueOptions = useMemo(() => {
    const venues = events
      .map((event) => ({ value: event.venue || "unknown", label: event.venue || "Unknown Venue" }))
      .filter((item, index, list) => list.findIndex((entry) => entry.value === item.value) === index);

    const options = [{ value: "all", label: "All Venues" }, ...venues];

    if (selectedVenue !== "all" && !options.some((option) => option.value === selectedVenue)) {
      options.push({ value: selectedVenue, label: "Selected Venue" });
    }

    return options;
  }, [events, selectedVenue]);

  const filteredItems = useMemo(() => {
    return events
      .filter((item) => {
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
          term.length === 0 ||
          item.title.toLowerCase().includes(term) ||
          item.organizing_club?.name?.toLowerCase().includes(term) ||
          item.venue?.toLowerCase().includes(term);

        const matchesVenue = selectedVenue === "all" ? true : item.venue === selectedVenue;

        return matchesSearch && matchesVenue;
      })
      .map(formatEventRow);
  }, [events, searchTerm, selectedVenue]);

  const totalPages =
    searchTerm || selectedVenue !== "all"
      ? Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
      : totalPagesFromServer;

  const paginatedItems = filteredItems.slice(0, ITEMS_PER_PAGE);
  const clampedPage = Math.min(currentPage, totalPages);
  const totalCount = searchTerm || selectedVenue !== "all" ? filteredItems.length : totalCountFromServer;

  const [liveEventStats, setLiveEventStats] = useState<typeof eventManagementStats | null>(null);
  const [liveVenueOccupancy, setLiveVenueOccupancy] = useState<Array<VenueOccupancyPoint | StatsTrendPoint> | null>(null);

  useEffect(() => {
    let mounted = true;
    getAnalyticsDashboard("last-8-months")
      .then((res) => {
        if (!mounted) return;
        if (res?.forbidden || !res?.data) return;
        const data = res?.data || {};
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

      <EventsTable
        items={paginatedItems}
        currentPage={clampedPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={totalCount}
      />

      <VenueOccupancyTrends points={liveVenueOccupancy ?? venueOccupancyTrends} />
    </div>
  );
}
