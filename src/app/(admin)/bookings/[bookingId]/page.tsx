import type { Metadata } from "next";
import { BookingDetailView } from "@/components/dashboard/bookings/BookingDetailView";
import {
  bookingDetailItems,
  bookingVenueCards,
  myBookingItems,
} from "@/data/dummy";

interface BookingDetailPageProps {
  params: Promise<{ bookingId: string }>;
}

function titleToId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildFallbackBookingDetail(bookingId: string) {
  const booking = myBookingItems.find((item) => item.id === bookingId);
  const venueByBooking = booking
    ? bookingVenueCards.find((venue) => titleToId(venue.name) === titleToId(booking.venueName))
    : null;
  const venue = venueByBooking ?? bookingVenueCards.find((item) => item.id === bookingId);

  if (!booking && !venue) {
    return null;
  }

  const title = venue?.name ?? booking?.venueName ?? "Campus Venue";
  const cover = venue?.imageUrl ?? "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop";

  return {
    id: bookingId,
    venueSelectionId: venue?.id ?? bookingId,
    isBookable: venue?.status !== "blocked",
    venueIdLabel: bookingId.toUpperCase(),
    availabilityLabel: venue?.status === "blocked" ? "Limited Access" : "Available Now",
    title,
    subtitle: `${title} booking details generated from available dashboard data.`,
    coverImageUrl: cover,
    gallery: [cover, cover, cover, cover],
    aboutParagraphs: [
      "Detailed content for this booking is not configured yet. Update bookingDetailItems in the dummy data source to provide richer descriptions, amenities, and schedule data.",
    ],
    capacityLabel: venue ? `${venue.capacity.toLocaleString()} Seats` : "N/A",
    levelLabel: "Ground Floor",
    amenities: ["WiFi", "Projector", "Audio"],
    locationTitle: "AASTU Campus",
    locationAddress: "Location details to be updated.",
    locationMapImageUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&auto=format&fit=crop",
    availabilityMonthLabel: "Current",
    availabilityDays: [
      { dayLabel: "M", date: "1" },
      { dayLabel: "T", date: "2" },
      { dayLabel: "W", date: "3", active: true },
      { dayLabel: "T", date: "4" },
      { dayLabel: "F", date: "5" },
      { dayLabel: "S", date: "6" },
      { dayLabel: "S", date: "7" },
    ],
    upcomingEvents: [
      { id: "fallback-1", dateLabel: "TBD", timeLabel: "--", title: booking?.eventTitle ?? "No event title" },
    ],
    similarVenues: bookingVenueCards.slice(0, 3).map((item) => ({
      id: item.id,
      tag: item.category.replace("-", " "),
      name: item.name,
      capacity: item.capacity,
      location: "AASTU Campus",
      imageUrl: item.imageUrl,
    })),
  };
}

export async function generateMetadata({ params }: BookingDetailPageProps): Promise<Metadata> {
  const { bookingId } = await params;
  const detail = bookingDetailItems[bookingId] ?? buildFallbackBookingDetail(bookingId);

  return {
    title: detail ? `${detail.title} Booking` : "Booking Details",
  };
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { bookingId } = await params;
  const detail = bookingDetailItems[bookingId] ?? buildFallbackBookingDetail(bookingId);

  if (!detail) {
    return (
      <div className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Booking details were not found.
      </div>
    );
  }

  return <BookingDetailView item={detail} />;
}
