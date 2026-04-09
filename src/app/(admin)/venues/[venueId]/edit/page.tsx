import type { Metadata } from "next";
import { VenueEditor } from "@/components/dashboard/venues/VenueEditor";
import { venueItems } from "@/data/dummy";

interface EditVenuePageProps {
  params: Promise<{ venueId: string }>;
}

function toCategoryValue(typeLabel: string) {
  return typeLabel.toLowerCase().replace(/\s+/g, "-");
}

function parseCapacity(capacityLabel: string) {
  return capacityLabel.replace(/[^0-9]/g, "");
}

export async function generateMetadata({ params }: EditVenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = venueItems.find((item) => item.id === venueId);

  return {
    title: venue ? `Edit ${venue.name}` : "Edit Venue",
  };
}

export default async function EditVenuePage({ params }: EditVenuePageProps) {
  const { venueId } = await params;
  const venue = venueItems.find((item) => item.id === venueId);

  return (
    <VenueEditor
      mode="edit"
      venueId={venueId}
      initialValues={{
        name: venue?.name ?? "",
        category: venue ? toCategoryValue(venue.typeLabel) : "",
        maxCapacity: venue ? parseCapacity(venue.capacityLabel) : "",
        floorLevel: venue?.location.split(",")[1]?.trim() ?? "",
        campusBlock: venue?.location.split(",")[0] ?? "",
        nearbyLandmarks: venue?.locationHint ?? "",
        shortDescription: `Venue used for ${venue?.typeLabel.toLowerCase() ?? "campus activities"}.`,
        fullDescription:
          "This venue record is currently managed by Student Union administrators. Please keep details updated for bookings and event planning.",
        publicAvailability: venue?.status !== "inactive",
        mapCoordinates: "9.0182, 38.7525",
        heroImageUrl: venue?.imageUrl ?? "",
        heroImageName: undefined,
        galleryImages: [
          venue?.imageUrl ?? "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop",
        ],
        thumbnailUrl: venue?.imageUrl ?? "",
        thumbnailName: undefined,
        amenities: ["Audio System", "WiFi", "Projector"],
        managerName: "Facilities Office",
        phoneNumber: "+251911223344",
        officialEmail: "venue@aastu.edu.et",
      }}
    />
  );
}
