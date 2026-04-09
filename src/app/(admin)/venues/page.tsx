import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { VenuesContent } from "@/components/dashboard/venues/VenuesContent";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "Campus Venues",
};

export default function VenuesPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Venues</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Campus Venues</h1>
          <p className="mt-1 text-sm text-gray-500">Detailed oversight and inventory of all AASTU union facilities.</p>
        </div>

        <Link
          href="/venues/new"
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:self-auto"
        >
          <Plus size={15} />
          Add New Venue
        </Link>
      </section>

      <VenuesContent />

      <DashboardFooter />
    </div>
  );
}
