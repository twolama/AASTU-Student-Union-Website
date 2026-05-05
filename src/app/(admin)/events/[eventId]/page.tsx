import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/dashboard/events/EventDetailView";
import type { EventDetailItem } from "@/types/dashboard";
import { eventDetailItems, eventManagementItems } from "@/data/dummy";

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

type ApiEventDetail = {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  status?: string;
  isMegaEvent?: boolean;
  isArchived?: boolean;
  maxCapacity?: number;
  organizingClub?: {
    id: string;
    name: string;
    category?: string;
    categoryName?: string;
    logoLabel?: string;
  };
  venue?: string;
  physicalLocationDetails?: string;
  coverImage?: string;
  startDateTime?: string;
  endDateTime?: string;
  dateDay?: string;
  dateMonth?: string;
  registrationLink?: string;
  attendeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  logistics?: Array<{ label?: string; value?: string }>;
  attendance?: {
    current?: number;
    capacity?: number;
    waitlist?: number;
    vips?: number;
  };
  attendees?: Array<{
    id: string;
    name: string;
    avatar?: string;
    initials?: string;
  }>;
  venue_details?: {
    id?: string;
    name?: string;
    location?: string;
    campus_block?: string;
    floor_level?: string;
    nearby_landmarks?: string;
    short_description?: string;
    full_description?: string;
    google_maps_url?: string;
    hero_image?: string | null;
    thumbnail?: string | null;
    image_url?: string | null;
    map_coordinates?: { lat?: number | null; lng?: number | null } | null;
    gallery?: Array<{
      id?: string;
      image?: string | null;
      image_url?: string | null;
      url?: string | null;
      alt_text?: string | null;
    }>;
  };
  volunteers?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
      initials?: string;
    };
    event: string;
    fullName: string;
    studentId: string;
    phone: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
};

function formatDateLabel(value?: string) {
  if (!value) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatTimeRange(start?: string, end?: string) {
  if (!start || !end) {
    return "TBD";
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  return `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function formatVenueLocationLabel(event: ApiEventDetail) {
  const venue = event.venue_details;
  const locationParts = [
    venue?.location,
    venue?.campus_block ? `Block ${venue.campus_block}` : "",
    venue?.floor_level ? `Floor ${venue.floor_level}` : "",
  ].filter(Boolean);

  if (locationParts.length > 0) {
    return locationParts.join(" · ");
  }

  return event.physicalLocationDetails || event.venue || "AASTU Campus";
}

function formatVenueGallery(event: ApiEventDetail) {
  return (event.venue_details?.gallery || [])
    .map((image) => image.image_url || image.url || image.image || "")
    .filter(Boolean);
}

function formatEventDetail(event: ApiEventDetail): EventDetailItem {
  const startDate = event.startDateTime ? new Date(event.startDateTime) : null;
  const dateDay = event.dateDay || (startDate ? String(startDate.getDate()).padStart(2, "0") : "--");
  const dateMonth = event.dateMonth || (startDate ? startDate.toLocaleString("en-US", { month: "short" }).toUpperCase() : "TBD");
  const venueTitle = event.venue || "Campus Venue";
  const venueDetails = event.venue_details;
  const venueGallery = formatVenueGallery(event);
  const status = ["live-now", "upcoming", "archived"].includes(event.status || "")
    ? (event.status as EventDetailItem["status"])
    : "upcoming";

  return {
    id: event.id,
    title: event.title,
    summary: event.shortDescription || "No event summary is available.",
    status,
    megaEvent: Boolean(event.isMegaEvent),
    coverImageUrl:
      event.coverImage ||
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop",
    dateDay,
    dateMonth,
    venueTitle,
    venueSubtitle: formatVenueLocationLabel(event),
    timeRange: formatTimeRange(event.startDateTime, event.endDateTime),
    startDateLabel: formatDateLabel(event.startDateTime),
    locationName: formatVenueLocationLabel(event),
    locationWing: venueDetails?.nearby_landmarks || event.physicalLocationDetails || "AASTU North Campus",
    description: event.description || "",
    aboutParagraphs:
      event.description?.split(/\r?\n/).filter(Boolean) || ["This event profile was generated from the backend event record."],
    attendance: {
      current: event.attendeeCount ?? 0,
      capacity: event.maxCapacity ?? 0,
      waitlist: event.attendance?.waitlist ?? 0,
      vips: event.attendance?.vips ?? 0,
    },
    organizingClub: {
      clubId: event.organizingClub?.id ?? "",
      name: event.organizingClub?.name ?? "Student Union",
      subtitle: event.organizingClub?.categoryName || "Managed by Student Union",
    },
    logistics:
      Array.isArray(event.logistics) && event.logistics.length > 0
        ? event.logistics.map((item, index) => ({
            id: `logistics-${index}`,
            label: item.label || `Detail ${index + 1}`,
            value: item.value || "",
          }))
        : [
            { id: "venue", label: "Venue", value: venueTitle },
            { id: "status", label: "Status", value: status },
          ],
    mapImageUrl:
      venueDetails?.hero_image || venueDetails?.thumbnail || venueDetails?.image_url || "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&auto=format&fit=crop",
    venueImageUrl: venueDetails?.hero_image || venueDetails?.thumbnail || venueDetails?.image_url || event.coverImage || undefined,
    venueGallery,
    venueGoogleMapsUrl: venueDetails?.google_maps_url || "",
    venueMapCoordinates: venueDetails?.map_coordinates || null,
    venueLocationLabel: formatVenueLocationLabel(event),
    venueNearbyLandmarks: venueDetails?.nearby_landmarks || event.physicalLocationDetails || "",
    venueDescription: venueDetails?.short_description || venueDetails?.full_description || "",
  };
}

function buildFallbackEventDetail(eventId: string) {
  const event = eventManagementItems.find((item) => item.id === eventId);

  if (!event) {
    return null;
  }

  return {
    id: event.id,
    title: event.title,
    summary: `${event.title} is managed in the AASTU events dashboard. Detailed preview content can be expanded here.`,
    status: event.status,
    megaEvent: false,
    coverImageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop",
    dateDay: "--",
    dateMonth: "TBD",
    venueTitle: event.venue,
    venueSubtitle: "AASTU Campus",
    timeRange: event.scheduleTime,
    startDateLabel: event.scheduleDate,
    locationName: event.venue,
    locationWing: "Main Campus",
    description: "This preview card was generated from event summary data.",
    aboutParagraphs: [
      "This preview card was generated from event summary data. Add a full event profile in dummy data or API response for richer details.",
    ],
    attendance: {
      current: 0,
      capacity: 100,
      waitlist: 0,
      vips: 0,
    },
    organizingClub: {
      clubId: "club-1",
      name: event.organizingClub,
      subtitle: "Managed by Student Union",
    },
    logistics: [
      { id: "venue", label: "Venue Name", value: event.venue },
      { id: "schedule", label: "Schedule", value: `${event.scheduleDate} · ${event.scheduleTime}` },
      { id: "status", label: "Current Status", value: event.status },
    ],
    mapImageUrl:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&auto=format&fit=crop",
    venueImageUrl:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&auto=format&fit=crop",
    venueGallery: [
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop",
    ],
    venueGoogleMapsUrl: "https://www.google.com/maps?q=AASTU%20Campus&output=embed",
    venueLocationLabel: "AASTU Campus",
    venueNearbyLandmarks: "Main Campus",
    venueDescription: "This preview card was generated from event summary data.",
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

    const payload = (await response.json()) as { data?: ApiEventDetail };
    return payload?.data ?? null;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const fallback = eventDetailItems[eventId] ?? buildFallbackEventDetail(eventId);

  return {
    title: fallback ? fallback.title : "Event Preview",
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const event = await fetchEventDetail(eventId);
  const item = event ? formatEventDetail(event) : eventDetailItems[eventId] ?? buildFallbackEventDetail(eventId);

  if (!item) {
    notFound();
  }

  return <EventDetailView item={item} />;
}
