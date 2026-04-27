"use client";

import { useParams } from "next/navigation";
import { VenueDetailView } from "@/components/dashboard/venues/VenueDetailView";
import { useVenue } from "@/hooks/useVenues";
import type { VenueDetailItem } from "@/types/dashboard";
import type { Venue } from "@/schemas/venue.schema";

interface VenueDetailPageProps {
  params: Promise<{ venueId: string }>;
}

const mapToVenueDetailItem = (venue: Venue): VenueDetailItem => ({
  id: venue.id || "",
  name: venue.name,
  subtitle: venue.shortDescription || `${venue.name} is a student-managed facility at AASTU.`,
  status: venue.status,
  locationLabel: venue.location || (venue.campusBlock && venue.floorLevel ? `Block ${venue.campusBlock}, Floor ${venue.floorLevel}` : venue.campusBlock ? `Block ${venue.campusBlock}` : venue.floorLevel ? `Level ${venue.floorLevel}` : "Main Campus"),
  capacityLabel: venue.capacityLabel || `${venue.maxCapacity} Seats`,
  coverImageUrl: venue.heroImage || venue.imageUrl || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop",
  logoLabel: venue.name ? venue.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() : "V",
  overview: venue.fullDescription ? [venue.fullDescription] : ["No detailed description provided."],
  gallery: (venue.gallery || []).map(img => typeof img === 'string' ? img : img.image),
  amenities: venue.amenities || [],
  mapImageUrl: "", // Removed placeholder
  gettingThere: venue.nearbyLandmarks || "AASTU Campus",
  contact: {
    name: venue.managerName || venue.contact?.name || "Facilities Office",
    role: venue.contact?.role || "Venue Manager",
    phone: venue.managerPhone || venue.contact?.phone || "Not provided",
    email: venue.managerEmail || venue.contact?.email || "venue@aastu.edu.et",
  },
});

export default function VenueDetailPage() {
  const { venueId } = useParams() as { venueId: string };
  const { data: venue, isLoading, error } = useVenue(venueId);

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading venue details...</div>;
  }

  if (error || !venue) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <span className="text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Venue not found</h2>
        <p className="mt-1 text-sm text-gray-500">
          {error instanceof Error ? error.message : "The requested venue could not be loaded."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-sm font-medium text-[#c49a22] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const item = mapToVenueDetailItem(venue);

  return <VenueDetailView item={item} />;
}
