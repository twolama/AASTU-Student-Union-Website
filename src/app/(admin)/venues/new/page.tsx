import type { Metadata } from "next";
import { VenueEditor } from "@/components/dashboard/venues/VenueEditor";

export const metadata: Metadata = {
  title: "Create New Venue",
};

export default function AddVenuePage() {
  return (
    <VenueEditor
      mode="create"
      initialValues={{
        name: "",
        category: "",
        maxCapacity: "",
        floorLevel: "",
        campusBlock: "",
        nearbyLandmarks: "",
        shortDescription: "",
        fullDescription: "",
        publicAvailability: true,
        mapCoordinates: "",
        heroImageUrl: "",
        heroImageName: undefined,
        galleryImages: [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop",
        ],
        thumbnailUrl: "",
        thumbnailName: undefined,
        amenities: ["Audio System", "WiFi", "Projector"],
        managerName: "",
        phoneNumber: "",
        officialEmail: "",
      }}
    />
  );
}
