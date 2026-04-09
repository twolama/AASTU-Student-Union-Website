import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, MapPin, Pencil, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { VenueItem, VenueStatus } from "@/types/dashboard";

interface VenuesTableProps {
  items: VenueItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  viewMode: "list" | "grid";
}

const statusVariantMap: Record<VenueStatus, "success" | "warning" | "default"> = {
  active: "success",
  maintenance: "warning",
  inactive: "default",
};

const statusLabelMap: Record<VenueStatus, string> = {
  active: "Active",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

export function VenuesTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  viewMode,
}: VenuesTableProps) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
      <div className="hidden md:block">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fbfcff] text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  <th className="px-4 py-3">Venue Details</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-[8px] border border-gray-100 bg-gray-100">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <Link href={`/venues/${item.id}`} className="font-semibold text-[#1f2a44] transition-colors hover:text-[#c49a22]">
                            {item.name}
                          </Link>
                          <p className="text-xs text-gray-500">Type: {item.typeLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <p>{item.location}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} />
                        {item.locationHint}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <User size={12} className="text-gray-400" />
                        {item.capacityLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={statusVariantMap[item.status]}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
                          item.status === "active" && "bg-emerald-100 text-emerald-700",
                          item.status === "maintenance" && "bg-amber-100 text-amber-700"
                        )}
                      >
                        {statusLabelMap[item.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link href={`/venues/${item.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label={`View ${item.name}`}>
                          <Eye size={15} />
                        </Link>
                        <Link href={`/venues/${item.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label={`Edit ${item.name}`}>
                          <Pencil size={15} />
                        </Link>
                        <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label={`Delete ${item.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-3 p-3 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[10px] border border-gray-100 bg-[#fbfcff]">
                <div className="relative h-36 bg-gray-100">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/venues/${item.id}`} className="block truncate text-base font-semibold text-[#1f2a44] transition-colors hover:text-[#c49a22]">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500">{item.typeLabel}</p>
                    </div>
                    <Badge
                      variant={statusVariantMap[item.status]}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        item.status === "active" && "bg-emerald-100 text-emerald-700",
                        item.status === "maintenance" && "bg-amber-100 text-amber-700"
                      )}
                    >
                      {statusLabelMap[item.status]}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="inline-flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" />
                      {item.location}
                    </p>
                    <p className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                      <User size={12} className="text-gray-400" />
                      {item.capacityLabel}
                    </p>
                    <p className="text-xs text-gray-400">{item.locationHint}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link href={`/venues/${item.id}`} className="inline-flex h-8 flex-1 items-center justify-center gap-2 rounded-md bg-[#1f2a44] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#152136]">
                      <Eye size={14} />
                      View
                    </Link>
                    <Link href={`/venues/${item.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-white hover:text-gray-700" aria-label={`Edit ${item.name}`}>
                      <Pencil size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-[10px] border border-gray-100 p-3">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-[8px] border border-gray-100 bg-gray-100">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/venues/${item.id}`} className="block truncate font-semibold text-[#1f2a44] transition-colors hover:text-[#c49a22]">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500">{item.typeLabel}</p>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">{item.location}</p>
            <p className="mt-1 text-xs font-semibold text-gray-700">{item.capacityLabel}</p>
            <Badge variant={statusVariantMap[item.status]} className="mt-2 rounded-full px-2 py-0.5 text-[10px] uppercase">
              {statusLabelMap[item.status]}
            </Badge>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-3 py-3 sm:px-4">
        <p className="text-xs text-gray-500">
          Showing {items.length > 0 ? (currentPage - 1) * 4 + 1 : 0} to {(currentPage - 1) * 4 + items.length} of {totalCount} results
        </p>

        <nav aria-label="Venues pagination" className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 px-3 text-xs text-gray-500 transition-colors hover:bg-gray-50"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-md border border-[#c49a22] bg-[#c49a22] px-3 text-xs font-semibold text-white"
            aria-current="page"
          >
            {currentPage}
          </button>

          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 px-3 text-xs text-gray-500 transition-colors hover:bg-gray-50"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </nav>
      </div>
    </section>
  );
}
