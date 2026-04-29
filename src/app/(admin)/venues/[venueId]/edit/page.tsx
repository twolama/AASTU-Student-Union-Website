"use client";

import { useParams } from "next/navigation";
import { VenueEditor } from "@/components/dashboard/venues/VenueEditor";
import { useVenue } from "@/hooks/useVenues";

interface EditVenuePageProps {
  params: Promise<{ venueId: string }>;
}

export default function EditVenuePage() {
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

  return (
    <VenueEditor
      mode="edit"
      venueId={venueId}
      initialValues={{
        name: venue.name,
        category: venue.category?.id ?? "",
        status: venue.status || "active",
        maxCapacity: String(venue.maxCapacity),
        floorLevel: venue.floorLevel || "",
        campusBlock: venue.campusBlock || "",
        nearbyLandmarks: venue.nearbyLandmarks || "",
        shortDescription: venue.shortDescription || "",
        fullDescription: venue.fullDescription || "",
        publicAvailability: !!venue.isPubliclyAvailable,
        mapCoordinates: (venue.mapCoordinates?.lat && venue.mapCoordinates?.lng) 
          ? `${venue.mapCoordinates.lat}, ${venue.mapCoordinates.lng}` 
          : "9.0182, 38.7525",
        heroImageUrl: venue.heroImage || "",
        heroImageName: undefined,
        gallery: (venue.gallery || []).map(img => ({ id: img.id, url: img.image })),
        thumbnailUrl: venue.thumbnail || "",
        thumbnailName: undefined,
        amenities: venue.amenities || [],
        managerName: venue.managerName || "",
        phoneNumber: venue.managerPhone || "",
        officialEmail: venue.managerEmail || "",
      }}
    />
  );
}
