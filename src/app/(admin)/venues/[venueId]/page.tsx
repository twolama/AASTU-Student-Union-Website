import type { Metadata } from "next";
import { VenueDetailView } from "@/components/dashboard/venues/VenueDetailView";
import { venueDetailItems, venueItems } from "@/data/dummy";

interface VenueDetailPageProps {
  params: Promise<{ venueId: string }>;
}

function buildFallbackVenueDetail(venueId: string) {
  const venue = venueItems.find((item) => item.id === venueId);

  if (!venue) {
    return null;
  }

  return {
    id: venue.id,
    name: venue.name,
    subtitle: `${venue.name} is managed in the campus venues dashboard.`,
    status: venue.status,
    locationLabel: venue.location,
    capacityLabel: venue.capacityLabel,
    coverImageUrl: venue.imageUrl,
    logoLabel: venue.name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase(),
    overview: [
      "This venue profile is generated from summary data. Add full venue detail content for richer previews.",
    ],
    gallery: [venue.imageUrl],
    amenities: ["WiFi", "Projector"],
    upcomingSchedule: [
      {
        id: "default-schedule",
        day: "--",
        month: "TBD",
        title: "No scheduled events yet",
        timeRange: "Set upcoming bookings",
        organizer: "Student Union",
        status: "pending" as const,
      },
    ],
    mapImageUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop",
    gettingThere: "Campus navigation details will appear here once configured.",
    venueStatistics: {
      monthlyUtilization: "--",
      eventsThisMonth: "0 Events",
      averageRating: "--",
    },
    contact: {
      name: "Facilities Office",
      role: "Venue Manager",
      phone: "Not provided",
      email: "venue@aastu.edu.et",
    },
  };
}

export async function generateMetadata({ params }: VenueDetailPageProps): Promise<Metadata> {
  const { venueId } = await params;
  const item = venueDetailItems[venueId] ?? buildFallbackVenueDetail(venueId);

  return {
    title: item ? item.name : "Venue Details",
  };
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { venueId } = await params;
  const item = venueDetailItems[venueId] ?? buildFallbackVenueDetail(venueId);

  if (!item) {
    return (
      <div className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Venue was not found.
      </div>
    );
  }

  return <VenueDetailView item={item} />;
}
