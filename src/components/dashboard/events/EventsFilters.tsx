"use client";

import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchBar } from "@/components/ui/SearchBar";

interface EventsFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedClub: string;
  onSelectedClubChange: (value: string) => void;
  selectedVenue: string;
  onSelectedVenueChange: (value: string) => void;
  selectedStatus: string;
  onSelectedStatusChange: (value: string) => void;
}

const clubOptions = [
  { value: "all", label: "All Clubs" },
  { value: "google-dsc", label: "Google DSC AASTU" },
  { value: "aastu-arts", label: "AASTU Arts Club" },
  { value: "robotics", label: "Robotics Society" },
  { value: "rotaract", label: "Rotaract AASTU" },
  { value: "ieee-women", label: "IEEE Women Chapter" },
  { value: "eco-action", label: "Eco Action Team" },
  { value: "debate", label: "Debate Society" },
];

const venueOptions = [
  { value: "all", label: "All Venues" },
  { value: "grand-library-hall", label: "Grand Library Hall" },
  { value: "outdoor-plaza", label: "Outdoor Plaza" },
  { value: "auditorium", label: "Block 54 Auditorium" },
  { value: "ict-seminar-room", label: "ICT Center Seminar Room" },
  { value: "innovation-hub", label: "Innovation Hub" },
  { value: "student-lounge", label: "Student Lounge" },
  { value: "main-quadrant", label: "Main Quadrant" },
  { value: "senate-hall", label: "Senate Hall" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "live-now", label: "Live Now" },
  { value: "upcoming", label: "Upcoming" },
  { value: "archived", label: "Archived" },
];

export function EventsFilters({
  searchTerm,
  onSearchTermChange,
  selectedClub,
  onSelectedClubChange,
  selectedVenue,
  onSelectedVenueChange,
  selectedStatus,
  onSelectedStatusChange,
}: EventsFiltersProps) {
  return (
    <section className="rounded-[10px] border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_180px]">
        <SearchBar
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Filter by event title or keywords..."
          className="h-10 rounded-[10px]"
          containerClassName="w-full"
        />

        <DropdownSelect
          label=""
          value={selectedClub}
          options={clubOptions}
          onValueChange={onSelectedClubChange}
          className="[&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
        />

        <DropdownSelect
          label=""
          value={selectedVenue}
          options={venueOptions}
          onValueChange={onSelectedVenueChange}
          className="[&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
        />

        <DropdownSelect
          label=""
          value={selectedStatus}
          options={statusOptions}
          onValueChange={onSelectedStatusChange}
          className="[&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
        />
      </div>
    </section>
  );
}
