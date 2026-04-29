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
        status: "active",
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
        gallery: [],
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
