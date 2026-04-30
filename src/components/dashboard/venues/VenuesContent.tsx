"use client";

import { useMemo, useState, useEffect } from "react";
import { venueStats } from "@/data/dummy";
import { getAnalyticsDashboard } from "@/api/services/analytics.service";
import { VenuesFilters } from "@/components/dashboard/venues/VenuesFilters";
import { VenuesStatsSection } from "@/components/dashboard/venues/VenuesStatsSection";
import { VenuesTable } from "@/components/dashboard/venues/VenuesTable";
import { useVenues, useVenueCategories } from "@/hooks/useVenues";
import type { VenueItem } from "@/types/dashboard";
import type { Venue } from "@/schemas/venue.schema";

const ITEMS_PER_PAGE = 4;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export function VenuesContent() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { data: categoriesData } = useVenueCategories();
  const { data: venuesResponse, isLoading } = useVenues(
    currentPage,
    ITEMS_PER_PAGE,
    selectedType !== "all" ? selectedType : undefined,
    selectedStatus !== "all" ? selectedStatus : undefined
  );

  const typeOptions = useMemo(() => {
    const base = [{ value: "all", label: "All Types" }];
    if (!categoriesData) return base;
    return [...base, ...categoriesData.map(cat => ({ value: cat.slug, label: cat.name }))];
  }, [categoriesData]);

  const mapToVenueItem = (venue: Venue): VenueItem => ({
    id: venue.id || "",
    name: venue.name,
    typeLabel: venue.category?.name || "Uncategorized",
    imageUrl: venue.thumbnail || venue.heroImage || venue.imageUrl || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop",
    location: venue.campusBlock || venue.location || "Main Campus",
    locationHint: venue.nearbyLandmarks || "AASTU",
    capacityLabel: venue.capacityLabel || `${venue.maxCapacity} Seats`,
    status: venue.status,
  });

  const venues = useMemo(() => {
    if (!venuesResponse) return [];
    return venuesResponse.data.map(mapToVenueItem);
  }, [venuesResponse]);

  const totalPages = venuesResponse?.meta.totalPages || 1;
  const totalCount = venuesResponse?.meta.total || 0;

  const [liveVenueStats, setLiveVenueStats] = useState<typeof venueStats | null>(null);

  useEffect(() => {
    let mounted = true;
    getAnalyticsDashboard("last-8-months")
      .then((res) => {
        if (!mounted) return;
        // Support both wrapped and unwrapped API payload shapes.
        const payload = res?.data && typeof res.data === "object" ? res.data : res;
        const stats =
          payload?.venue_stats ||
          payload?.venueStats ||
          payload?.data?.venue_stats ||
          payload?.data?.venueStats ||
          null;

        if (Array.isArray(stats)) {
          setLiveVenueStats(
            stats.map((s: any) => ({
              id: s.id,
              title: s.title,
              value: String(s.value ?? "0"),
              icon: s.icon || "Building2",
            }))
          );
        }
      })
      .catch((error) => {
        // Keep fallback cards but make failures visible during development.
        // eslint-disable-next-line no-console
        console.error("Failed to load venue analytics", error);
      })
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading venues...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <VenuesStatsSection items={liveVenueStats ?? venueStats} />

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
        typeOptions={typeOptions}
      />

      <VenuesTable
        items={venues}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={totalCount}
        viewMode={viewMode}
      />
    </div>
  );
}
