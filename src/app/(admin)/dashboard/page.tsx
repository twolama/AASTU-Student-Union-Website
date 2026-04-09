import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Overview</span>
      </nav>

      {/* ── Page Heading ────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor the pulse of AASTU Student Union activities.
        </p>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      <StatsSection />

      {/* ── Main Grid: Events + Activity ─────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left: Upcoming Events */}
        <UpcomingEvents />

        {/* Right: Recent Activity — full height panel */}
        <RecentActivity />
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mt-2 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
        © 2026 AASTU Student Union. Designed for administrators. All rights reserved.
      </footer>
    </div>
  );
}
