import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { BookingVenueCard, BookingVenueFilter } from "@/types/dashboard";

interface BrowseVenuesSectionProps {
  filters: BookingVenueFilter[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  items: BookingVenueCard[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function BrowseVenuesSection({
  filters,
  activeFilter,
  onFilterChange,
  items,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: BrowseVenuesSectionProps) {
  const start = items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = (currentPage - 1) * pageSize + items.length;

  return (
    <section className="space-y-4">
      <ul className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <li key={filter.id}>
              <button
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-[#17254c] bg-[#17254c] text-white"
                    : "border-gray-200 bg-[#f8f9fc] text-[#5f6f8d] hover:bg-gray-100"
                )}
              >
                {filter.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
            <div className="relative h-44 bg-gray-100">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              <Badge
                className={cn(
                  "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm",
                  item.status === "available"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-500 text-white"
                )}
              >
                {item.status === "available" ? "Active" : "Under Maintenance"}
              </Badge>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-[#1f2a44]">{item.name}</h3>
                <p className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6d7a95]">
                  <Users size={12} />
                  {item.capacity}
                </p>
              </div>

              <p className="line-clamp-2 text-sm leading-6 text-[#6d7a95]">{item.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <Link href={`/venues/${item.id}`} className="block">
                  <Button variant="outline" className="w-full text-xs h-9" type="button">
                    View Details
                  </Button>
                </Link>
                {item.status === "available" ? (
                  <Link href={`/bookings/new?venueId=${item.id}`} className="block">
                    <Button variant="goldSolid" className="w-full text-xs h-9" type="button">
                      Book Now
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost" className="w-full text-xs h-9 cursor-not-allowed bg-gray-50 text-gray-400" disabled type="button">
                    Unavailable
                  </Button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-gray-200 bg-white px-3 py-2.5">
        <p className="text-xs text-[#7f8ba2]">
          Showing {start} to {end} of {totalCount} results
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 px-2.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 items-center justify-center rounded-md border border-[#c49a22] bg-[#c49a22] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#b18a1f] disabled:opacity-50"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-[12px] bg-[#1c2752] px-5 py-5 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-xl font-semibold text-white">Need a specialized setup?</h4>
          <p className="mt-1 text-sm text-[#c6d0e8]">
            Contact the facilities management for custom technical requirements or catering services.
          </p>
        </div>

        <Button variant="goldSolid" className="min-w-40" type="button">
          Contact Manager
        </Button>
      </div>
    </section>
  );
}
