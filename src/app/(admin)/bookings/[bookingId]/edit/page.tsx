"use client";

import { useParams } from "next/navigation";
import { BookingRequestForm, type BookingRequestFormInitialData } from "@/components/dashboard/bookings/BookingRequestForm";
import { useBooking } from "@/hooks/useBookings";
import { Loader2 } from "lucide-react";

export default function EditBookingPage() {
  const { bookingId } = useParams() as { bookingId: string };
  const { data: booking, isLoading, error } = useBooking(bookingId);

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
        <p className="text-sm text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-[10px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        Booking was not found or failed to load.
      </div>
    );
  }

  const initialData: BookingRequestFormInitialData = {
    clubAssociation: booking.club || "",
    eventTitle: booking.event_title || "",
    expectedAttendance: String(booking.expected_attendance || 0),
    startDate: booking.start_date || "",
    endDate: booking.end_date || "",
    selectedSlots: booking.selected_slots || [],
    purpose: booking.purpose || "",
    selectedVenueId: booking.venue || "",
    equipment: booking.equipment_requested || [],
    specialRequests: booking.special_requests || "",
    guidelinesChecked: booking.guidelines_acknowledged || false,
  };

  return <BookingRequestForm mode="edit" bookingId={bookingId} initialData={initialData} />;
}
