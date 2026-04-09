import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus2, ChevronRight } from "lucide-react";
import { EventsContent } from "@/components/dashboard/events/EventsContent";

export const metadata: Metadata = {
  title: "Event Management",
};

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Events</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Event Management</h1>
          <p className="mt-1 text-sm text-gray-500">Create, update, and manage events in one place.</p>
        </div>

        <Link
          href="/events/new"
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:self-auto"
        >
          <CalendarPlus2 size={15} />
          Create New Event
        </Link>
      </section>

      <EventsContent />

      <footer className="mt-2 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
        © 2026 AASTU Student Union. Designed for administrators. All rights reserved.
      </footer>
    </div>
  );
}
