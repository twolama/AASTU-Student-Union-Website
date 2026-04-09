import type { Metadata } from "next";
import { EventDetailView } from "@/components/dashboard/events/EventDetailView";
import { eventDetailItems, eventManagementItems } from "@/data/dummy";

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
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
  };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const item = eventDetailItems[eventId] ?? buildFallbackEventDetail(eventId);

  return {
    title: item ? item.title : "Event Preview",
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const item = eventDetailItems[eventId] ?? buildFallbackEventDetail(eventId);

  if (!item) {
    return (
      <div className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Event was not found.
      </div>
    );
  }

  return <EventDetailView item={item} />;
}
