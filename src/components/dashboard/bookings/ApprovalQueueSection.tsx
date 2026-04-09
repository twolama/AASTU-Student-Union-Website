import { Search, ShieldCheck } from "lucide-react";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Input } from "@/components/ui/Input";
import type { BookingRequestDateRange, BookingRequestItem } from "@/types/dashboard";

interface ApprovalQueueSectionProps {
  items: BookingRequestItem[];
  searchTerm: string;
  selectedVenueType: string;
  selectedDateRange: BookingRequestDateRange;
  onSearchTermChange: (value: string) => void;
  onSelectedVenueTypeChange: (value: string) => void;
  onSelectedDateRangeChange: (value: BookingRequestDateRange) => void;
  onApprove: (item: BookingRequestItem) => void;
  onReject: (item: BookingRequestItem) => void;
}

const venueTypeOptions = [
  { value: "all", label: "All Venues" },
  { value: "hall", label: "Hall" },
  { value: "auditorium", label: "Auditorium" },
  { value: "meeting-room", label: "Meeting Room" },
  { value: "outdoor", label: "Outdoor" },
];

const dateRangeOptions: { value: BookingRequestDateRange; label: string }[] = [
  { value: "next-7-days", label: "Upcoming (Next 7 days)" },
  { value: "next-14-days", label: "Upcoming (Next 14 days)" },
  { value: "this-month", label: "This month" },
  { value: "all", label: "All requests" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ApprovalQueueSection({
  items,
  searchTerm,
  selectedVenueType,
  selectedDateRange,
  onSearchTermChange,
  onSelectedVenueTypeChange,
  onSelectedDateRangeChange,
  onApprove,
  onReject,
}: ApprovalQueueSectionProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-[12px] border border-gray-200 bg-white p-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)_minmax(0,0.6fr)]">
        <label className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Search Requesters</span>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa4b7]" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              className="h-11 rounded-[10px] border-gray-200 pl-9"
              placeholder="Search name, club, or purpose..."
            />
          </div>
        </label>

        <DropdownSelect
          label="Venue Type"
          value={selectedVenueType}
          options={venueTypeOptions}
          onValueChange={onSelectedVenueTypeChange}
          className="space-y-1 [&>p]:text-[10px] [&>p]:tracking-[0.12em] [&>div>button]:h-11 [&>div>button]:rounded-[10px]"
        />

        <DropdownSelect
          label="Date Range"
          value={selectedDateRange}
          options={dateRangeOptions}
          onValueChange={onSelectedDateRangeChange}
          className="space-y-1 [&>p]:text-[10px] [&>p]:tracking-[0.12em] [&>div>button]:h-11 [&>div>button]:rounded-[10px]"
        />
      </div>

      <div className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#fbfcff] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">
                <th className="px-5 py-3.5">Requester & Club</th>
                <th className="px-5 py-3.5">Venue</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Purpose</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f7d9b2] text-xs font-semibold text-[#80511f]">
                        {initials(item.requesterName)}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1f2a44]">{item.requesterName}</p>
                        <p className="text-xs text-[#b48a1b]">{item.clubName}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-[#44506b]">
                    <p className="font-semibold text-[#1f2a44]">{item.venueName}</p>
                    <p className="text-xs text-[#8a95a8]">{item.capacityLabel}</p>
                  </td>

                  <td className="px-5 py-4 text-[#44506b]">
                    <p className="font-semibold text-[#1f2a44]">{item.dateLabel}</p>
                    <p className="text-xs text-[#8a95a8]">{item.timeRange}</p>
                  </td>

                  <td className="px-5 py-4 text-[#6d7a95]">
                    <p className="max-w-[260px] truncate">{item.purpose}</p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onApprove(item)}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-[#b48a1b] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#9a7616]"
                      >
                        <ShieldCheck size={13} />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(item)}
                        className="inline-flex h-8 items-center rounded-md bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#8a95a8]">
                    No pending requests match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {items.map((item) => (
            <article key={item.id} className="rounded-[10px] border border-gray-100 bg-[#fbfcff] p-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f7d9b2] text-[10px] font-semibold text-[#80511f]">
                  {initials(item.requesterName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1f2a44]">{item.requesterName}</p>
                  <p className="truncate text-xs text-[#b48a1b]">{item.clubName}</p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-[#6d7a95]">
                <p>
                  <span className="font-semibold text-[#1f2a44]">Venue:</span> {item.venueName}
                </p>
                <p>{item.capacityLabel}</p>
                <p>
                  <span className="font-semibold text-[#1f2a44]">When:</span> {item.dateLabel} · {item.timeRange}
                </p>
                <p className="line-clamp-2">{item.purpose}</p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(item)}
                  className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-[#b48a1b] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#9a7616]"
                >
                  <ShieldCheck size={13} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onReject(item)}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}

          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#8a95a8]">No pending requests match the current filters.</p>
          ) : null}
        </div>

        <div className="border-t border-gray-100 px-5 py-3.5 text-sm text-[#7f8ba2]">
          Showing {items.length} pending requests
        </div>
      </div>
    </section>
  );
}
