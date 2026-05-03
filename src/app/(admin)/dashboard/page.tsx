import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentAnnouncements } from "@/components/dashboard/RecentAnnouncements";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import type { Activity, Event, StatCard, TrendDirection } from "@/types/dashboard";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default async function DashboardPage() {
  let overviewItems: StatCard[] | undefined;
  let recentActivityItems: Activity[] | undefined;
  let upcomingMegaEvents: Event[] | undefined;
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
    const res = await fetch(`${baseUrl}/api/v1/analytics/dashboard/?period=last-8-months`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data || {};

      const toStringValue = (value: unknown, fallback = ""): string => {
        if (typeof value === "string" || typeof value === "number") return String(value);
        return fallback;
      };

      const toNumberValue = (value: unknown, fallback = 0): number => {
        const parsed = typeof value === "number" ? value : Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
      };

      const toTrendDirection = (value: unknown): TrendDirection => {
        if (value === "down" || value === "neutral") return value;
        return "up";
      };

      const overview = data.overview;
      if (Array.isArray(overview)) {
        overviewItems = overview.map((it: Record<string, unknown>) => ({
          id: toStringValue(it.id),
          title: toStringValue(it.title),
          value: typeof it.value === "number" ? it.value : toStringValue(it.value),
          trend: toStringValue(it.trend),
          trendDirection: toTrendDirection(it.trend_direction ?? it.trendDirection),
          icon: toStringValue(it.icon),
          iconBg: toStringValue(it.icon_bg ?? it.iconBg),
          requiresAttention: Boolean(it.requiresAttention ?? it.requires_attention),
        }));
      }

      const recentActivity = data.recent_activity ?? data.recentActivity;
      if (Array.isArray(recentActivity)) {
        recentActivityItems = recentActivity.map((it: Record<string, unknown>) => ({
          id: toStringValue(it.id),
          type: toStringValue(it.type) as Activity["type"],
          boldLabel: toStringValue(it.bold_label ?? it.boldLabel),
          description: toStringValue(it.description),
          timestamp: toStringValue(it.timestamp),
        }));
      }

      const upcomingMega = data.upcoming_mega_events ?? data.upcomingMegaEvents;
      if (Array.isArray(upcomingMega)) {
        upcomingMegaEvents = upcomingMega.map((it: Record<string, unknown>) => ({
          id: toStringValue(it.id),
          title: toStringValue(it.title),
          venue: toStringValue(it.venue),
          imageUrl: toStringValue(it.image_url ?? it.imageUrl),
          dateLabel: toStringValue(it.date_label ?? it.dateLabel),
          attendeeCount: toNumberValue(it.attendee_count ?? it.attendeeCount),
          attendees: Array.isArray(it.attendees)
            ? it.attendees.map((attendee) => ({
                id: toStringValue((attendee as Record<string, unknown>).id),
                name: toStringValue((attendee as Record<string, unknown>).name),
              }))
            : [],
        }));
      }
    }
  } catch {
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
