import type { Metadata } from "next";
import { PublicEventsPage } from "@/components/public/events/PublicEventsPage";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming public events by the AASTU Student Union.",
};

export default function EventsPage() {
  return <PublicEventsPage />;
}
