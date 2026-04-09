"use client";

import { LayoutGrid, List } from "lucide-react";
import { DropdownSelect } from "@/components/ui/DropdownSelect";

interface VenuesFiltersProps {
  selectedType: string;
  onSelectedTypeChange: (value: string) => void;
  selectedStatus: string;
  onSelectedStatusChange: (value: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

const venueTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "auditorium", label: "Auditorium" },
  { value: "meeting-room", label: "Meeting Room" },
  { value: "outdoor-space", label: "Outdoor Space" },
  { value: "indoor-space", label: "Indoor Space" },
  { value: "laboratory", label: "Laboratory" },
  { value: "seminar-hall", label: "Seminar Hall" },
  { value: "debate-room", label: "Debate Room" },
];

const venueStatusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "inactive", label: "Inactive" },
];

export function VenuesFilters({
  selectedType,
  onSelectedTypeChange,
  selectedStatus,
  onSelectedStatusChange,
  viewMode,
  onViewModeChange,
}: VenuesFiltersProps) {
  return (
    <section className="rounded-[10px] border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-gray-600">Filter By:</span>

          <DropdownSelect
            label=""
            value={selectedType}
            options={venueTypeOptions}
            onValueChange={onSelectedTypeChange}
            className="min-w-[170px] [&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
          />

          <DropdownSelect
            label=""
            value={selectedStatus}
            options={venueStatusOptions}
            onValueChange={onSelectedStatusChange}
            className="min-w-[170px] [&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
          />
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <button
            type="button"
            className={
              viewMode === "grid"
                ? "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c49a22]/30 bg-[#fdf8ec] text-[#c49a22]"
                : "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white transition-colors hover:bg-gray-50 hover:text-gray-600"
            }
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={
              viewMode === "list"
                ? "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c49a22]/30 bg-[#fdf8ec] text-[#c49a22]"
                : "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white transition-colors hover:bg-gray-50 hover:text-gray-600"
            }
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
