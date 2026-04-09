import type { Metadata } from "next";
import { BookingRequestForm } from "@/components/dashboard/bookings/BookingRequestForm";

export const metadata: Metadata = {
  title: "New Booking Request",
};

export default function NewBookingRequestPage() {
  return <BookingRequestForm />;
}
