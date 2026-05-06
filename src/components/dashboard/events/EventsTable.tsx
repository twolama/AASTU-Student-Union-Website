"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, MoreVertical, Pencil, ShieldAlert, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { cn } from "@/lib/utils";
import { useArchiveEvent, useDeleteEvent } from "@/hooks/useEvents";
import { usePermissions } from "@/hooks/usePermissions";
import type { EventManagementItem } from "@/types/dashboard";

interface EventsTableProps {
  items: EventManagementItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
}

const statusVariantMap = {
  "live-now": "success",
  upcoming: "info",
  archived: "default",
} as const;

const statusLabelMap = {
  "live-now": "Live Now",
  upcoming: "Upcoming",
  archived: "Archived",
} as const;

export function EventsTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}: EventsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pendingArchive, setPendingArchive] = useState<EventManagementItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventManagementItem | null>(null);

  const { hasPermission } = usePermissions();
  const archiveEvent = useArchiveEvent();
  const deleteEvent = useDeleteEvent();
  const canEditEvent = hasPermission("events.edit");
  const canDeleteEvent = hasPermission("events.delete");
  const showActions = canEditEvent || canDeleteEvent;


  async function confirmArchive() {
    if (!pendingArchive) {
      return;
    }

    await archiveEvent.mutateAsync(pendingArchive.id);
    setPendingArchive(null);
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    await deleteEvent.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <section className="space-y-6">
      {/* Card Grid Layout */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
          >
            {/* Header with Title and Actions */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <Link
                href={`/events/${item.id}`}
                className="flex-1 group"
              >
                <h3 className="font-semibold text-[#1f2a44] text-base group-hover:text-[#c49a22] transition-colors line-clamp-2 min-h-[3rem] flex items-start">
                  {item.title}
                </h3>
              </Link>

              {showActions && (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label={`Actions for ${item.title}`}
                    aria-expanded={openMenuId === item.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuId((current) => (current === item.id ? null : item.id));
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === item.id && (
                    <div
                      className="absolute right-0 top-full mt-1 z-50 w-40 overflow-hidden rounded-[10px] border border-gray-200 bg-white py-1 text-left shadow-lg"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {canEditEvent ? (
                        <Link
                          href={`/events/${item.id}/edit`}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                      ) : null}
                      {canEditEvent ? (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setPendingArchive(item);
                            setOpenMenuId(null);
                          }}
                        >
                          <ShieldAlert size={14} />
                          Archive
                        </button>
                      ) : null}
                      {canDeleteEvent ? (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setPendingDelete(item);
                            setOpenMenuId(null);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Club Info */}
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#b6861f] mb-3">
              {item.organizingClub}
            </p>

            {/* Content Details */}
            <div className="space-y-3 mb-4 border-t border-gray-100 pt-4">
              {/* Venue */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Venue</p>
                <p className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-1">{item.venue}</span>
                </p>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Schedule</p>
                <p className="text-sm font-semibold text-gray-700">{item.scheduleDate}</p>
                <p className="text-xs text-gray-500">{item.scheduleTime}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <Badge
                variant={statusVariantMap[item.status]}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] w-full text-center",
                  item.status === "live-now" && "bg-emerald-100 text-emerald-700"
                )}
              >
                {statusLabelMap[item.status]}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {showActions && openMenuId && (
        <button
          type="button"
          aria-label="Close actions menu"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      {canEditEvent ? (
        <ConfirmationDialog
          open={pendingArchive !== null}
          title="Archive Event"
          message={`Archive \"${pendingArchive?.title}\"? It will be marked as archived and hidden from the active workflow.`}
          confirmLabel="Archive Event"
          isLoading={archiveEvent.isPending}
          onConfirm={confirmArchive}
          onCancel={() => setPendingArchive(null)}
        />
      ) : null}

      {canDeleteEvent ? (
        <ConfirmationDialog
          open={pendingDelete !== null}
          title="Delete Event"
          message={`Delete \"${pendingDelete?.title}\"? This cannot be undone.`}
          confirmLabel="Delete Event"
          isLoading={deleteEvent.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-0 py-4 mt-6">
        <p className="text-xs text-gray-500">
          Showing {items.length > 0 ? (currentPage - 1) * 4 + 1 : 0} to {(currentPage - 1) * 4 + items.length} of {totalCount} results
        </p>

        <nav aria-label="Events pagination" className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[#c49a22] text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </section>
  );
}
