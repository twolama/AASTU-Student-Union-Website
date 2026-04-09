import type { Metadata } from "next";
import { EventEditor } from "@/components/dashboard/events/EventEditor";

export const metadata: Metadata = {
  title: "Create New Event",
};

export default function CreateEventPage() {
  return (
    <EventEditor
      mode="create"
      initialValues={{
        title: "",
        shortDescription: "",
        aboutEvent: "",
        bannerUrl: "",
        bannerFileName: undefined,
        registrationLink: "",
        startDateTime: "",
        endDateTime: "",
        venueSelection: "",
        clubAssociation: "",
        physicalLocationDetails: "",
        maxCapacity: "",
        megaEvent: true,
        archived: false,
        volunteers: [],
      }}
    />
  );
}
