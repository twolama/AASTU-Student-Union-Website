import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingRequestForm } from "@/components/dashboard/bookings/BookingRequestForm";

export const metadata: Metadata = {
  title: "New Booking Request",
};

function BookingRequestFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
      <div className="h-[420px] animate-pulse rounded-xl border border-gray-200 bg-white" />
    </div>
  );
}

export default function NewBookingRequestPage() {
  return (
    <Suspense fallback={<BookingRequestFormFallback />}>
      <BookingRequestForm />
    </Suspense>
  );
}
