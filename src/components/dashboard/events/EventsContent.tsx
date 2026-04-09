"use client";

import { useMemo, useState } from "react";
import { EventsFilters } from "@/components/dashboard/events/EventsFilters";
import { EventsStatsSection } from "@/components/dashboard/events/EventsStatsSection";
import { EventsTable } from "@/components/dashboard/events/EventsTable";
import { VenueOccupancyTrends } from "@/components/dashboard/events/VenueOccupancyTrends";
import {
  eventManagementItems,
  eventManagementStats,
  venueOccupancyTrends,
} from "@/data/dummy";

const ITEMS_PER_PAGE = 4;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

export function EventsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return eventManagementItems.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term.length === 0
          ? true
          : item.title.toLowerCase().includes(term) ||
            item.organizingClub.toLowerCase().includes(term) ||
            item.venue.toLowerCase().includes(term);

      const matchesClub = selectedClub === "all" ? true : normalize(item.organizingClub) === selectedClub;
      const matchesVenue = selectedVenue === "all" ? true : normalize(item.venue) === selectedVenue;
      const matchesStatus = selectedStatus === "all" ? true : item.status === selectedStatus;

      return matchesSearch && matchesClub && matchesVenue && matchesStatus;
    });
  }, [searchTerm, selectedClub, selectedVenue, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

  const paginatedItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredItems, totalPages]);

  const clampedPage = Math.min(currentPage, totalPages);

  return (
    <div className="space-y-4 sm:space-y-5">
      <EventsStatsSection items={eventManagementStats} />

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
      />

      <EventsTable
        items={paginatedItems}
        currentPage={clampedPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredItems.length}
      />

      <VenueOccupancyTrends points={venueOccupancyTrends} />
    </div>
  );
}
