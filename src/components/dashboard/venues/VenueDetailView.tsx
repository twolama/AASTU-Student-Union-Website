import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronLeft, ChevronRight, CircleAlert, MapPinned, Maximize2, Pencil, Phone, Star, User, Wrench, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import type { VenueDetailItem } from "@/types/dashboard";

interface VenueDetailViewProps {
  item: VenueDetailItem;
}

const statusVariantMap = {
  active: "success",
  maintenance: "warning",
  inactive: "default",
} as const;

const scheduleStatusStyles = {
  confirmed: "bg-[#f5edcc] text-[#8c6c14]",
  pending: "bg-[#e8edf8] text-[#5b6881]",
} as const;

export function VenueDetailView({ item }: VenueDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  const canViewVenues = hasPermission("venues.view") || hasPermission("venues.edit") || hasPermission("venues.create") || hasPermission("venues.delete");
  const canEditVenues = hasPermission("venues.edit");
  const canBookVenues = hasPermission("bookings.create");

  if (!canViewVenues) {
    return (
      <div className="rounded-[22px] border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
        You do not have permission to view venues.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/venues" className="text-gray-500 hover:text-gray-700">
          Venues
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{item.name}</span>
      </nav>

      <section className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
        <div
          className="relative min-h-[200px] bg-cover bg-center sm:min-h-[220px] lg:min-h-[240px]"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(12,22,46,0.35), rgba(12,22,46,0.72)), url(${item.coverImageUrl})` }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-[#132a61]/25 via-[#132a61]/40 to-[#0d1632]/85" />

          <div className="relative z-10 flex min-h-[200px] items-end p-3 sm:min-h-[220px] sm:p-4 lg:min-h-[240px] lg:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">{item.name}</h1>
                <div 
                  className="max-w-2xl text-xs leading-relaxed text-white/90 sm:text-sm prose prose-invert prose-sm"
                  dangerouslySetInnerHTML={{ __html: item.subtitle }}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/85">
                  <span className="inline-flex items-center gap-1">
                    <User size={12} />
                    {item.capacityLabel}
                  </span>
                  <Badge variant={statusVariantMap[item.status]} className="px-2 py-0.5 text-[10px] uppercase">
                    {item.status}
                  </Badge>
                  <span className="inline-flex items-center gap-1">
                    <MapPinned size={12} />
                    {item.locationLabel}
                  </span>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center">
                  {canEditVenues ? (
                    <Link href={`/venues/${item.id}/edit`} className="w-full lg:w-auto">
                      <Button variant="outline" className="h-9 w-full whitespace-nowrap rounded-[10px] border-white/35 bg-white/10 px-3 text-xs text-white hover:bg-white/25 sm:px-4 sm:text-sm lg:min-w-[148px]">
                        <Pencil size={14} />
                        Edit Venue
                      </Button>
                    </Link>
                  ) : null}
                  {item.status === "active" && canBookVenues ? (
                    <Link href={`/bookings/new?venueId=${item.id}`} className="w-full lg:w-auto">
                      <Button variant="goldSolid" className="h-9 w-full whitespace-nowrap rounded-[10px] px-3 text-xs sm:px-4 sm:text-sm lg:min-w-[148px]">
                        <CalendarDays size={14} />
                        Book Venue
                      </Button>
                    </Link>
                  ) : item.status !== "active" ? (
                    <div className="w-full lg:w-auto" title="Venue is not available for booking">
                      <Button variant="goldSolid" disabled className="h-9 w-full whitespace-nowrap rounded-[10px] px-3 text-xs sm:px-4 sm:text-sm lg:min-w-[148px] opacity-50 cursor-not-allowed">
                        <CalendarDays size={14} />
                        Unavailable
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
              <CircleAlert size={18} className="text-[#1f2a44]" />
              Venue Overview
            </h2>
            <div
              className={cn(
                "mt-3 text-sm leading-7 text-gray-600",
                "prose prose-slate max-w-none",
                "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#1f2a44] [&_h1]:mb-4",
                "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1f2a44] [&_h2]:mb-3",
                "[&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-[#c49a22] [&_blockquote]:pl-4 [&_blockquote]:italic",
                "[&_a]:text-[#c49a22] [&_a]:underline"
              )}
              dangerouslySetInnerHTML={{ __html: item.overview.join("") }}
            />
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
              <CalendarDays size={18} className="text-[#1f2a44]" />
              Venue Gallery
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {item.gallery.map((image, index) => (
                <div
                  key={`${item.id}-gallery-${index}`}
                  className="group relative h-28 cursor-pointer overflow-hidden rounded-[8px] border border-gray-200 bg-gray-100 sm:h-32"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image src={image} alt={`${item.name} gallery ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44] sm:text-2xl">
              <Wrench size={18} className="text-[#1f2a44]" />
              Amenities &amp; Specifications
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.amenities.length > 0 ? (
                item.amenities.map((entry) => (
                  <span key={entry} className="inline-flex items-center rounded-full bg-[#f5edcc] px-2.5 py-1 text-xs font-medium text-[#8c6c14]">
                    {entry}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-400">No specific amenities listed.</p>
              )}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[#1f2a44]">Location Details</h3>
            <div className="mt-3 space-y-3">
              <div className="rounded-[8px] bg-[#f8fafc] p-3 text-xs text-gray-600">
                <p className="font-semibold text-[#8c6c14]">Venue Location:</p>
                <p className="mt-1">{item.locationLabel}</p>
              </div>
              <div className="rounded-[8px] bg-[#f8fafc] p-3 text-xs text-gray-600">
                <p className="font-semibold text-[#8c6c14]">Getting there / Landmarks:</p>
                <p className="mt-1">{item.gettingThere}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Venue Contact</h3>
            <div className="mt-3">
              <p className="font-semibold text-[#1f2a44]">{item.contact.name}</p>
              <p className="text-xs text-gray-500">{item.contact.role}</p>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p className="inline-flex items-center gap-1.5">
                <Phone size={13} className="text-gray-400" />
                {item.contact.phone}
              </p>
              <p className="inline-flex items-center gap-1.5">
                <User size={13} className="text-gray-400" />
                {item.contact.email}
              </p>
            </div>
          </article>
        </aside>
      </section>

      <DashboardFooter />

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute right-4 top-4 z-60 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 top-1/2 z-60 -translate-y-1/2 rounded-full bg-white/5 p-3 text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = item.gallery.indexOf(selectedImage);
              const nextIndex = (currentIndex - 1 + item.gallery.length) % item.gallery.length;
              setSelectedImage(item.gallery[nextIndex]);
            }}
          >
            <ChevronLeft size={32} />
          </button>

          <button
            className="absolute right-4 top-1/2 z-60 -translate-y-1/2 rounded-full bg-white/5 p-3 text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = item.gallery.indexOf(selectedImage);
              const nextIndex = (currentIndex + 1) % item.gallery.length;
              setSelectedImage(item.gallery[nextIndex]);
            }}
          >
            <ChevronRight size={32} />
          </button>

          <div className="relative flex max-h-[80vh] max-w-[85vw] items-center justify-center overflow-hidden rounded-xl bg-black/40 shadow-2xl animate-in zoom-in-95 duration-300 sm:max-h-[75vh] sm:max-w-[70vw]">
            <img
              src={selectedImage}
              alt="Venue gallery expanded"
              className="h-full w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {item.gallery.indexOf(selectedImage) + 1} / {item.gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
