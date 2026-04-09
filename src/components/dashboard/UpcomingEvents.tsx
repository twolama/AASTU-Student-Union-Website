import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { EventCard } from "@/components/dashboard/EventCard";
import { upcomingEvents } from "@/data/dummy";

export function UpcomingEvents() {
  return (
    <section aria-label="Upcoming Mega Events">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Upcoming Mega Events</h2>
        <Link
          href="/events"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#c49a22] hover:text-[#a07d15] transition-colors"
        >
          <CalendarDays size={14} />
          View Calendar
        </Link>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
