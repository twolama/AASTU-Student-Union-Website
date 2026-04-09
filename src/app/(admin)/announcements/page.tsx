import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, PlusCircle } from "lucide-react";
import { AnnouncementsContent } from "@/components/dashboard/announcements/AnnouncementsContent";

export const metadata: Metadata = {
  title: "Campus Announcements",
};

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/announcements" className="text-gray-500 hover:text-gray-700">
          Announcements
        </Link>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Broadcast official news and updates to the AASTU student body.
          </p>
        </div>

        <Link
          href="/announcements/new"
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:self-auto"
        >
          <PlusCircle size={15} />
          Create New Announcement
        </Link>
      </section>

      <AnnouncementsContent />

      <footer className="mt-2 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
        © 2026 AASTU Student Union. Designed for administrators. All rights reserved.
      </footer>
    </div>
  );
}
