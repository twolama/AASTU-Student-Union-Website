"use client";

import { useParams } from "next/navigation";
import { BookingRequestDetailView } from "@/components/dashboard/bookings/BookingRequestDetailView";
import { useBooking } from "@/hooks/useBookings";
import { Loader2 } from "lucide-react";

export default function BookingDetailPage() {
  const { bookingId } = useParams() as { bookingId: string };
  const { data: booking, isLoading, error } = useBooking(bookingId);

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
        <p className="text-sm text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-[10px] border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <span className="text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Booking Not Found</h2>
        <p className="mt-1 text-sm text-gray-500">
          {error instanceof Error ? error.message : "The requested booking details could not be found."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-sm font-semibold text-[#c49a22] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <BookingRequestDetailView booking={booking} />;
}

