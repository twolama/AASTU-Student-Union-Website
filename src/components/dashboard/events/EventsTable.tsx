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
    <section className="overflow-visible rounded-[10px] border border-gray-200 bg-white shadow-sm">
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-[10px]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#fbfcff] text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                <th className="px-4 py-3">Event Title</th>
                <th className="px-4 py-3">Organizing Club</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Status</th>
                {showActions ? <th className="px-4 py-3 text-right">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-[#1f2a44]">
                    <Link href={`/events/${item.id}`} className="transition-colors hover:text-[#c49a22]">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.organizingClub}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-gray-400" />
                      {item.venue}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <p className="font-semibold text-gray-700">{item.scheduleDate}</p>
                    <p className="text-xs text-gray-500">{item.scheduleTime}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={statusVariantMap[item.status]}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        item.status === "live-now" && "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {statusLabelMap[item.status]}
                    </Badge>
                  </td>
                  {showActions ? (
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-flex justify-end">
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
                            className="absolute right-0 top-9 z-50 w-40 overflow-hidden rounded-[10px] border border-gray-200 bg-white py-1 text-left shadow-lg"
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
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-[10px] border border-gray-100 p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#1f2a44]">
                <Link href={`/events/${item.id}`} className="transition-colors hover:text-[#c49a22]">
                  {item.title}
                </Link>
              </h3>
              <div className="relative flex items-start gap-1.5">
                <Badge variant={statusVariantMap[item.status]} className="rounded-full px-2 py-0.5 text-[10px] uppercase">
                  {statusLabelMap[item.status]}
                </Badge>
                {showActions ? (
                  <>
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      aria-label={`Actions for ${item.title}`}
                      aria-expanded={openMenuId === item.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuId((current) => (current === item.id ? null : item.id));
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>

                    {openMenuId === item.id && (
                      <div
                        className="absolute right-0 top-8 z-50 w-40 overflow-hidden rounded-[10px] border border-gray-200 bg-white py-1 text-left shadow-lg"
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
                  </>
                ) : null}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">{item.organizingClub}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} className="text-gray-400" />
              {item.venue}
            </p>
            <p className="mt-2 text-xs font-semibold text-gray-700">{item.scheduleDate}</p>
            <p className="text-xs text-gray-500">{item.scheduleTime}</p>
          </article>
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-3 py-3 sm:px-4">
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
