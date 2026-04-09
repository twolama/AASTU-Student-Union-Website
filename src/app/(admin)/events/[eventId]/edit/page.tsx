import type { Metadata } from "next";
import { EventEditor } from "@/components/dashboard/events/EventEditor";
import { eventManagementItems } from "@/data/dummy";

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

function toClubValue(rawClub: string) {
  return rawClub.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

function toVenueValue(rawVenue: string) {
  return rawVenue.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

export async function generateMetadata({ params }: EditEventPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = eventManagementItems.find((item) => item.id === eventId);

  return {
    title: event ? `Edit ${event.title}` : "Edit Event",
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { eventId } = await params;
  const event = eventManagementItems.find((item) => item.id === eventId);

  return (
    <EventEditor
      mode="edit"
      eventId={eventId}
      initialValues={{
        title: event?.title ?? "",
        shortDescription: "Campus-wide event update and participation details.",
        aboutEvent:
          "This event record is being edited by Student Union administrators. Please validate logistics, venue information, and volunteer assignments before publication.",
        bannerUrl: "",
        bannerFileName: undefined,
        registrationLink: "",
        startDateTime: "",
        endDateTime: "",
        venueSelection: event ? toVenueValue(event.venue) : "",
        clubAssociation: event ? toClubValue(event.organizingClub) : "",
        physicalLocationDetails: event?.venue ?? "",
        maxCapacity: "",
        megaEvent: event?.status === "live-now",
        archived: event?.status === "archived",
        volunteers: [
          {
            id: "volunteer-1",
            fullName: "Abebe Bekele",
            studentId: "ETS1234/15",
            phone: "+251912344555",
            email: "abebe.bekele@aastustudent.edu.et",
            role: "Registration Desk",
          },
        ],
      }}
    />
  );
}
