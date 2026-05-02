import type { Metadata } from "next";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { EventEditor } from "@/components/dashboard/events/EventEditor";

export const metadata: Metadata = {
  title: "Create New Event",
};

export default function CreateEventPage() {
  return (
    <PermissionGate
      anyOf={["events.create"]}
      fallback={
        <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          You do not have permission to create events.
        </div>
      }
    >
      <EventEditor
        mode="create"
        initialValues={{
          title: "",
          short_description: "",
          status: "upcoming",
          is_mega_event: true,
          is_archived: false,
          max_capacity: 0,
          physical_location_details: "",
          cover_image: "",
          start_date_time: "",
          end_date_time: "",
          registration_link: "",
          description: "",
          logistics: {},
          attendance: {
            current: 0,
            capacity: 0,
            waitlist: 0,
            vips: 0
          },
          volunteers: [],
        }}
      />
    </PermissionGate>
  );
}
