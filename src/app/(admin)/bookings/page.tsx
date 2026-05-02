import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookingsContent } from "@/components/dashboard/bookings/BookingsContent";
import { BookingsPageActions } from "@/components/dashboard/bookings/BookingsPageActions";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "Bookings",
};

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Bookings</span>
      </nav>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage venue discovery, requests, and approvals.</p>
        </div>

        <BookingsPageActions />
      </section>

      <BookingsContent />

      <DashboardFooter />
    </div>
  );
}
