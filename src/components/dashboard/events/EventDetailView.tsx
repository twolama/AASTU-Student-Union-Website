"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { getEventStatusLabel, getEventStatusVariant, resolveEventStatus } from "@/lib/events/status";
import { useArchiveEvent, useDeleteEvent } from "@/hooks/useEvents";
import { usePermissions } from "@/hooks/usePermissions";
import type { EventDetailItem } from "@/types/dashboard";

interface EventDetailViewProps {
  item: EventDetailItem;
}

function getVenueMapEmbedUrl(item: EventDetailItem) {
  const coordinates = (item as EventDetailItem & { venueMapCoordinates?: { lat?: number | null; lng?: number | null } | null }).venueMapCoordinates;

  if (coordinates?.lat != null && coordinates?.lng != null) {
    return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=18&t=k&output=embed`;
  }

  if (item.venueGoogleMapsUrl) {
    if (item.venueGoogleMapsUrl.includes("/embed")) {
      return item.venueGoogleMapsUrl;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(item.venueLocationLabel || item.locationName)}&t=k&z=18&output=embed`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(item.venueLocationLabel || item.locationName)}&output=embed`;
}

export function EventDetailView({ item }: EventDetailViewProps) {
  const router = useRouter();
  const { hasPermission } = usePermissions(undefined, { hydrateFromCache: false });
  const [pendingArchive, setPendingArchive] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const archiveEvent = useArchiveEvent();
  const deleteEvent = useDeleteEvent();
  const attendancePercent = Math.min(100, Math.round((item.attendance.current / item.attendance.capacity) * 100));
  const canEditEvent = hasPermission("events.edit");
  const canDeleteEvent = hasPermission("events.delete");
  const venueGallery = item.venueGallery?.length ? item.venueGallery : [item.venueImageUrl || item.coverImageUrl].filter(Boolean);
  const mapEmbedUrl = getVenueMapEmbedUrl(item);
  const status = resolveEventStatus(item);

  async function confirmArchive() {
    await archiveEvent.mutateAsync(item.id);
    setPendingArchive(false);
    router.refresh();
  }

  async function confirmDelete() {
    await deleteEvent.mutateAsync(item.id);
    setPendingDelete(false);
    router.push("/events");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/events" className="text-gray-500 hover:text-gray-700">
          Events
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{item.title}</span>
      </nav>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {item.megaEvent ? (
                  <Badge variant="gold" className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
                    Mega Event
                  </Badge>
                ) : null}
                <Badge
                  variant={getEventStatusVariant(status)}
                  className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                >
                  {getEventStatusLabel(status)}
                </Badge>
              </div>

              <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1f2a44]">{item.title}</h1>
              <div 
                className="max-w-3xl text-sm text-gray-500 prose prose-sm prose-slate"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
            <div
              className="relative h-52 bg-cover bg-center sm:h-[300px]"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(7,11,24,0.15), rgba(7,11,24,0.45)), url(${item.coverImageUrl})` }}
            >
              <div className="absolute bottom-4 left-4 flex items-end gap-3 rounded-[10px] bg-black/35 px-3 py-2 text-white backdrop-blur-sm">
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[8px] border border-white/25 bg-white/10">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-white/85">{item.dateMonth}</span>
                  <span className="text-xl font-bold leading-none">{item.dateDay}</span>
                </div>

                <div>
                  <p className="text-2xl font-semibold leading-tight">{item.venueTitle}</p>
                  <p className="text-sm text-white/80">{item.venueSubtitle}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Time &amp; Duration</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-bold text-[#1f2a44]">
                <Clock3 size={16} className="text-[#c49a22]" />
                {item.timeRange}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.startDateLabel}</p>
            </article>

            <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Physical Location</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-bold text-[#1f2a44]">
                <MapPin size={16} className="text-[#c49a22]" />
                {item.locationName}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.locationWing}</p>
            </article>
          </div>

          <article className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#1f2a44]">Venue &amp; Location</h2>
              {item.venueGoogleMapsUrl ? (
                <a
                  href={item.venueGoogleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#f8f3e1] px-3 py-1 text-xs font-semibold text-[#8c6c14] transition-colors hover:bg-[#f3e7bf]"
                >
                  Open Maps
                  <ExternalLink size={12} />
                </a>
              ) : null}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-[#f8fafc]">
                <div className="relative h-64 sm:h-72">
                  <iframe
                    title={`${item.title} venue map`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[10px] bg-[#f8fafc] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Venue Name</p>
                  <p className="mt-1 text-lg font-bold text-[#1f2a44]">{item.venueTitle}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.venueLocationLabel || item.locationName}</p>
                </div>

                <div className="rounded-[10px] bg-[#f8fafc] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Landmarks</p>
                  <p className="mt-1 text-sm text-gray-600">{item.venueNearbyLandmarks || item.locationWing || "AASTU Campus"}</p>
                </div>

                {item.venueDescription ? (
                  <div className="rounded-[10px] bg-[#f8fafc] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Venue Notes</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{item.venueDescription}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-[#1f2a44]">Venue Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {venueGallery.map((image, index) => (
                <div key={`${item.id}-venue-gallery-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-gray-100">
                  <Image src={image} alt={`${item.title} venue gallery ${index + 1}`} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-[#1f2a44]">About the Event</h2>
            <div 
              className="mt-3 text-sm leading-7 text-gray-600 prose prose-slate max-w-none prose-headings:text-[#1f2a44] prose-strong:text-[#1f2a44]"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </article>
        </div>

        <aside className="space-y-4">
          {canEditEvent || canDeleteEvent ? (
            <div className="grid grid-cols-3 gap-2">
              {canEditEvent ? (
                <Link href={`/events/${item.id}/edit`}>
                  <Button variant="outline" size="md" className="h-9 w-full rounded-[10px] px-2 text-xs">
                    <Pencil size={14} />
                    Edit
                  </Button>
                </Link>
              ) : null}
              {canEditEvent ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="h-9 w-full rounded-[10px] px-2 text-xs"
                  onClick={() => setPendingArchive(true)}
                >
                  <ShieldAlert size={14} />
                  Archive
                </Button>
              ) : null}
              {canDeleteEvent ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="h-9 w-full rounded-[10px] border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => setPendingDelete(true)}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              ) : null}
            </div>
          ) : null}

          <article className="rounded-[10px] border border-[#223264] bg-[#1f2a44] p-4 text-white shadow-sm">
            <h2 className="text-base font-semibold">Attendance Stats</h2>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-5xl font-bold leading-none">{item.attendance.current}</span>
              <span className="pb-1 text-lg text-white/60">/{item.attendance.capacity}</span>
            </div>
            <p className="mt-1 text-xs text-[#f1ce67]">{attendancePercent}% Full</p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#c49a22]" style={{ width: `${attendancePercent}%` }} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[8px] bg-white/8 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/65">Waitlist</p>
                <p className="text-2xl font-bold leading-none">{item.attendance.waitlist}</p>
              </div>
              <div className="rounded-[8px] bg-white/8 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/65">VIPs</p>
                <p className="text-2xl font-bold leading-none">{item.attendance.vips}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Organizing Club</p>
            <div className="mt-3">
              <p className="text-lg font-bold text-[#1f2a44]">{item.organizingClub.name}</p>
              <p className="text-xs text-gray-500">{item.organizingClub.subtitle}</p>
            </div>

            <Link href={`/clubs/${item.organizingClub.clubId}`}>
              <Button variant="gold" size="md" className="mt-4 h-9 w-full rounded-[10px]">
                <Users size={14} />
                View Club Profile
              </Button>
            </Link>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Logistics Details</p>

            <div className="mt-3 space-y-2">
              {item.logistics.map((detail) => (
                <div key={detail.id} className="rounded-[8px] bg-[#f8fafc] px-3 py-2">
                  <p className="text-[11px] font-semibold text-gray-500">{detail.label}</p>
                  <p className="text-sm font-medium text-[#1f2a44]">{detail.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
            <div
              className="h-28 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(10,14,20,0.2), rgba(10,14,20,0.45)), url(${item.venueImageUrl || item.mapImageUrl})` }}
            />
            <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
              <span className="font-medium text-gray-600">{item.venueLocationLabel || item.locationWing}</span>
              {item.venueGoogleMapsUrl ? (
                <a href={item.venueGoogleMapsUrl} target="_blank" rel="noreferrer" className="text-[#c49a22] hover:underline">
                  Open Maps
                </a>
              ) : null}
            </div>
          </article>
        </aside>
      </section>

      {canEditEvent ? (
        <ConfirmationDialog
          open={pendingArchive}
          title="Archive Event"
          message={`Archive \"${item.title}\"? It will be marked as archived.`}
          confirmLabel="Archive Event"
          isLoading={archiveEvent.isPending}
          onConfirm={confirmArchive}
          onCancel={() => setPendingArchive(false)}
        />
      ) : null}

      {canDeleteEvent ? (
        <ConfirmationDialog
          open={pendingDelete}
          title="Delete Event"
          message={`Delete \"${item.title}\"? This cannot be undone.`}
          confirmLabel="Delete Event"
          isLoading={deleteEvent.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(false)}
        />
      ) : null}

      <DashboardFooter />
    </div>
  );
}
