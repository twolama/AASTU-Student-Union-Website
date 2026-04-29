import type { Metadata } from "next";
import { EventEditor } from "@/components/dashboard/events/EventEditor";
import type { EventEditorValues } from "@/components/dashboard/events/EventEditor";
import { eventManagementItems } from "@/data/dummy";

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

type ApiEventDetail = {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  coverImage?: string;
  registrationLink?: string;
  startDateTime?: string;
  endDateTime?: string;
  venue?: string;
  physicalLocationDetails?: string;
  maxCapacity?: number;
  isMegaEvent?: boolean;
  isArchived?: boolean;
  status?: string;
  organizingClub?: {
    id: string;
    name: string;
  };
  volunteers?: Array<{
    id: string;
    fullName: string;
    studentId?: string;
    phone?: string;
    email?: string;
    role?: string;
  }>;
};

function toClubValue(rawClub: string) {
  return rawClub.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

function toVenueValue(rawVenue: string) {
  return rawVenue.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

function buildInitialValues(event: ApiEventDetail): EventEditorValues {
  return {
    title: event.title || "",
    short_description: event.shortDescription || "",
    status: event.status || "upcoming",
    is_mega_event: Boolean(event.isMegaEvent),
    is_archived: Boolean(event.isArchived),
    max_capacity: event.maxCapacity ?? 0,
    physical_location_details: event.physicalLocationDetails || event.venue || "",
    cover_image: event.coverImage || "",
    start_date_time: event.startDateTime || "",
    end_date_time: event.endDateTime || "",
    registration_link: event.registrationLink || "",
    description: event.description || "",
    logistics: {},
    attendance: {},
    volunteers:
      event.volunteers?.map((volunteer) => ({
        id: volunteer.id,
        full_name: volunteer.fullName || "",
        student_id: volunteer.studentId || "",
        phone: volunteer.phone || "",
        email: volunteer.email || "",
        role: volunteer.role || "",
        is_active: true,
      })) ?? [],
  };
}

async function fetchEventDetail(eventId: string): Promise<ApiEventDetail | null> {
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
    const apiUrl = `${baseUrl}/api/v1/events/${eventId}/`;
    console.log(`[EDIT PAGE] Fetching event from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`[EDIT PAGE] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[EDIT PAGE] Failed to fetch event ${eventId}: ${response.status} ${response.statusText}`);
      return null;
    }

    const payload = await response.json();
    console.log(`[EDIT PAGE] Fetched event ${eventId}:`, payload);
    return payload?.data ?? null;
  } catch (error) {
    console.error(`[EDIT PAGE] Error fetching event ${eventId}:`, error);
    return null;
  }
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
  const event = await fetchEventDetail(eventId);
  console.log(`[EDIT PAGE] Event data for ${eventId}:`, event);

  const fallbackEvent = eventManagementItems.find((item) => item.id === eventId);
  console.log(`[EDIT PAGE] Fallback event:`, fallbackEvent);

  const initialValues = event
    ? buildInitialValues(event)
    : {
      title: fallbackEvent?.title ?? "",
      short_description: "Campus-wide event update and participation details.",
      status: fallbackEvent?.status || "upcoming",
      is_mega_event: fallbackEvent?.status === "live-now",
      is_archived: fallbackEvent?.status === "archived",
      max_capacity: fallbackEvent?.maxCapacity ?? 0,
      physical_location_details: fallbackEvent?.venue ?? "",
      cover_image: "",
      start_date_time: "",
      end_date_time: "",
      registration_link: "",
      description: "This event record is being edited by Student Union administrators. Please validate logistics, venue information, and volunteer assignments before publication.",
      logistics: {},
      attendance: {},
      volunteers: [],
    };

  console.log(`[EDIT PAGE] Initial values:`, initialValues);

  return (
    <EventEditor
      mode="edit"
      eventId={eventId}
      initialValues={initialValues}
    />
  );
}
