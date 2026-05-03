import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentAnnouncements } from "@/components/dashboard/RecentAnnouncements";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default async function DashboardPage() {
  let overviewItems = undefined;
  let recentActivityItems = undefined;
  let upcomingMegaEvents = undefined;
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
    const res = await fetch(`${baseUrl}/api/v1/analytics/dashboard/?period=last-8-months`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data || {};

      const overview = data.overview;
      if (Array.isArray(overview)) {
        overviewItems = overview.map((it: any) => ({
          id: it.id,
          title: it.title,
          value: it.value,
          trend: it.trend,
          trendDirection: it.trend_direction ?? it.trendDirection,
          icon: it.icon,
          iconBg: it.icon_bg ?? it.iconBg,
          requiresAttention: it.requiresAttention ?? it.requires_attention,
        }));
      }

      const recentActivity = data.recent_activity ?? data.recentActivity;
      if (Array.isArray(recentActivity)) {
        recentActivityItems = recentActivity.map((it: any) => ({
          id: it.id,
          type: it.type,
          boldLabel: it.bold_label ?? it.boldLabel,
          description: it.description,
          timestamp: it.timestamp,
        }));
      }

      const upcomingMega = data.upcoming_mega_events ?? data.upcomingMegaEvents;
      if (Array.isArray(upcomingMega)) {
        upcomingMegaEvents = upcomingMega.map((it: any) => ({
          id: it.id,
          title: it.title,
          venue: it.venue,
          imageUrl: it.image_url ?? it.imageUrl,
          dateLabel: it.date_label ?? it.dateLabel,
          attendeeCount: it.attendee_count ?? it.attendeeCount ?? 0,
          attendees: (it.attendees || []).map((a: any) => ({ id: a.id, name: a.name })),
        }));
      }
    }
  } catch (e) {
    // ignore and fall back to defaults
  }

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
      <PermissionGate
        anyOf={['analytics.view']}
        fallback={
          <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            You do not have permission to view the dashboard overview statistics.
          </div>
        }
      >
        {overviewItems ? (
          <StatsSection items={overviewItems} className="xl:grid-cols-4" />
        ) : (
          <StatsSection className="xl:grid-cols-4" />
        )}
      </PermissionGate>

      {/* ── Latest Announcements ──────────────────────────────── */}
      <RecentAnnouncements />

      {/* ── Main Grid: Events + Activity ─────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left: Upcoming Events */}
        <UpcomingEvents items={upcomingMegaEvents} />

        {/* Right: Recent Activity — full height panel */}
        <RecentActivity items={recentActivityItems} />
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
        <DashboardFooter />
    </div>
  );
}
