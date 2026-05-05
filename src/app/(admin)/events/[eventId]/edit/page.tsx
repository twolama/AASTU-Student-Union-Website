import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { EventEditor } from "@/components/dashboard/events/EventEditor";
import type { EventEditorValues } from "@/components/dashboard/events/EventEditor";
import { eventManagementItems } from "@/data/dummy";

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

type ApiEventDetail = {
  id: string;
  title: string;
  short_description?: string;
  shortDescription?: string;
  description?: string;
  cover_image?: string;
  coverImage?: string;
  registration_link?: string;
  registrationLink?: string;
  start_date_time?: string;
  startDateTime?: string;
  end_date_time?: string;
  endDateTime?: string;
  venue?: string;
  physical_location_details?: string;
  physicalLocationDetails?: string;
  max_capacity?: number;
  maxCapacity?: number;
  is_mega_event?: boolean;
  isMegaEvent?: boolean;
  is_archived?: boolean;
  isArchived?: boolean;
  status?: string;
  organizing_club?: { id: string; name: string };
  organizingClub?: { id: string; name: string };
  volunteers?: Volunteer[];
  booking?: string;
  logistics?: Record<string, unknown>;
};

type Volunteer = {
  id: string;
  full_name?: string;
  fullName?: string;
  student_id?: string;
  studentId?: string;
  phone?: string;
  email?: string;
  role?: string;
};

function buildInitialValues(event: ApiEventDetail): EventEditorValues {
  return {
    title: event.title || "",
    short_description: event.short_description || event.shortDescription || "",
    status: event.status || "upcoming",
    is_mega_event: Boolean(event.is_mega_event ?? event.isMegaEvent),
    is_archived: Boolean(event.is_archived ?? event.isArchived),
    max_capacity: event.max_capacity ?? event.maxCapacity ?? 0,
    physical_location_details: event.physical_location_details || event.physicalLocationDetails || event.venue || "",
    cover_image: event.cover_image || event.coverImage || "",
    start_date_time: event.start_date_time || event.startDateTime || "",
    end_date_time: event.end_date_time || event.endDateTime || "",
    registration_link: event.registration_link || event.registrationLink || "",
    description: event.description || "",
    logistics: event.logistics || {},
    attendance: {},
    organizing_club: event.organizing_club?.id || event.organizingClub?.id || "",
    volunteers:
      event.volunteers?.map((volunteer: Volunteer) => ({
        id: volunteer.id,
        full_name: volunteer.full_name || volunteer.fullName || "",
        student_id: volunteer.student_id || volunteer.studentId || "",
        phone: volunteer.phone || "",
        email: volunteer.email || "",
        role: volunteer.role || "",
        is_active: true,
      })) ?? [],
    booking_id: event.booking || "",
  };
}

async function fetchEventDetail(eventId: string): Promise<ApiEventDetail | null> {
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
    const apiUrl = `${baseUrl}/api/v1/events/${eventId}/`;


    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });



    if (!response.ok) {

      return null;
    }

    const payload = await response.json();

    return payload?.data ?? null;
  } catch {
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


  const fallbackEvent = eventManagementItems.find((item) => item.id === eventId);


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
      booking_id: "",
      organizing_club: "",
    };



  if (!event && !fallbackEvent) {
    notFound();
  }

  return (
    <PermissionGate
      anyOf={["events.edit"]}
      fallback={
        <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          You do not have permission to edit events.
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="rounded-[10px] border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            Loading event editor...
          </div>
        }
      >
        <EventEditor
          mode="edit"
          eventId={eventId}
          initialValues={initialValues}
        />
      </Suspense>
    </PermissionGate>
  );
}
