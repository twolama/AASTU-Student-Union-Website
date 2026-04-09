"use client";

import { useMemo, useState } from "react";
import { venueItems, venueStats } from "@/data/dummy";
import { VenuesFilters } from "@/components/dashboard/venues/VenuesFilters";
import { VenuesStatsSection } from "@/components/dashboard/venues/VenuesStatsSection";
import { VenuesTable } from "@/components/dashboard/venues/VenuesTable";

const ITEMS_PER_PAGE = 4;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export function VenuesContent() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredItems = useMemo(() => {
    return venueItems.filter((item) => {
      const matchesType = selectedType === "all" ? true : normalize(item.typeLabel) === selectedType;
      const matchesStatus = selectedStatus === "all" ? true : item.status === selectedStatus;
      return matchesType && matchesStatus;
    });
  }, [selectedType, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((clampedPage - 1) * ITEMS_PER_PAGE, clampedPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 sm:space-y-5">
      <VenuesStatsSection items={venueStats} />

      <VenuesFilters
        selectedType={selectedType}
        onSelectedTypeChange={(value) => {
          setSelectedType(value);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={(value) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <VenuesTable
        items={paginatedItems}
        currentPage={clampedPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredItems.length}
        viewMode={viewMode}
      />
    </div>
  );
}
