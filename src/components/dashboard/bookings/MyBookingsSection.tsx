import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { BookingStatus, MyBookingItem } from "@/types/dashboard";

interface MyBookingsSectionProps {
  items: MyBookingItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const statusLabelMap: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  cancelled: "Cancelled",
};

const statusClassMap: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-600",
};

export function MyBookingsSection({
  items,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: MyBookingsSectionProps) {
  const start = items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = (currentPage - 1) * pageSize + items.length;

  return (
    <section className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fbfcff] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">
              <th className="px-5 py-3.5">Venue Name</th>
              <th className="px-5 py-3.5">Event Title</th>
              <th className="px-5 py-3.5">Date & Time</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-5 py-4 text-base font-semibold text-[#1f2a44]">{item.venueName}</td>
                <td className="px-5 py-4 text-base leading-5 text-[#44506b]">{item.eventTitle}</td>
                <td className="px-5 py-4 text-[#79839a]">
                  <p>{item.dateLabel}</p>
                  <p>{item.timeLabel}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusClassMap[item.status])}>
                    {statusLabelMap[item.status]}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/bookings/${item.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#b48a1b] transition-colors hover:text-[#8f6d14]"
                  >
                    View Details
                    <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-[10px] border border-gray-100 bg-[#fbfcff] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1f2a44]">{item.venueName}</p>
                <p className="mt-1 text-sm text-[#44506b]">{item.eventTitle}</p>
              </div>

              <Badge className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", statusClassMap[item.status])}>
                {statusLabelMap[item.status]}
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#79839a]">
              <p>{item.dateLabel}</p>
              <p>{item.timeLabel}</p>
            </div>

            <Link
              href={`/bookings/${item.id}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#b48a1b] transition-colors hover:text-[#8f6d14]"
            >
              View Details
              <ExternalLink size={12} />
            </Link>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3.5 sm:px-5">
        <p className="text-sm text-[#7f8ba2]">
          Showing {start} to {end} of {totalCount} bookings
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold transition-colors",
                  isActive
                    ? "border-[#c49a22] bg-[#c49a22] text-white"
                    : "border-transparent text-[#6f7f99] hover:bg-gray-100"
                )}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
