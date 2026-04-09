import type { Metadata } from "next";
import { BookingRequestForm, type BookingRequestFormInitialData } from "@/components/dashboard/bookings/BookingRequestForm";
import { bookingVenueCards, myBookingItems } from "@/data/dummy";

interface EditBookingPageProps {
  params: Promise<{ bookingId: string }>;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toIsoDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "2024-10-25";
  }

  return parsed.toISOString().slice(0, 10);
}

function toHourSlot(value: string) {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!match) {
    return "10:00";
  }

  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hour < 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function buildInitialData(bookingId: string): BookingRequestFormInitialData | null {
  const booking = myBookingItems.find((item) => item.id === bookingId);

  if (!booking) {
    return null;
  }

  const matchedVenue = bookingVenueCards.find((venue) => normalize(venue.name) === normalize(booking.venueName));
  const selectedVenue = matchedVenue ?? bookingVenueCards[0];

  return {
    clubAssociation: "coding-club",
    eventTitle: booking.eventTitle,
    expectedAttendance: String(Math.max(1, selectedVenue.capacity - 20)),
    startDate: toIsoDate(booking.dateLabel),
    endDate: toIsoDate(booking.dateLabel),
    selectedSlots: [toHourSlot(booking.timeLabel)],
    purpose: `Request update for ${booking.eventTitle}.`,
    selectedVenueId: selectedVenue.id,
    equipment: ["microphones", "sound-system"],
    specialRequests: "",
  };
}

export async function generateMetadata({ params }: EditBookingPageProps): Promise<Metadata> {
  const { bookingId } = await params;
  const booking = myBookingItems.find((item) => item.id === bookingId);

  return {
    title: booking ? `Edit ${booking.eventTitle}` : "Edit Booking Request",
  };
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  const { bookingId } = await params;
  const initialData = buildInitialData(bookingId);

  if (!initialData) {
    return (
      <div className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Booking was not found.
      </div>
    );
  }

  return <BookingRequestForm mode="edit" bookingId={bookingId} initialData={initialData} />;
}
