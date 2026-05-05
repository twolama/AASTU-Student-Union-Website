"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentAnnouncements } from "@/components/dashboard/RecentAnnouncements";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { getAnalyticsDashboard } from "@/api/services/analytics.service";
import type { Activity, TrendDirection } from "@/types/dashboard";

const DASHBOARD_QUERY_KEY = ["analytics", "dashboard", "last-8-months"] as const;

type AnalyticsDashboardPayload = {
  forbidden?: boolean;
  data?: {
    overview?: Array<Record<string, unknown>>;
    recent_activity?: Array<Record<string, unknown>>;
    recentActivity?: Array<Record<string, unknown>>;
    upcoming_mega_events?: Array<Record<string, unknown>>;
    upcomingMegaEvents?: Array<Record<string, unknown>>;
  } | null;
  message?: string;
};

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return fallback;
}

function toNumberValue(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toTrendDirection(value: unknown): TrendDirection {
  if (value === "down" || value === "neutral") return value;
  return "up";
}

function mapDashboardData(payload: AnalyticsDashboardPayload) {
  const data = payload.data ?? {};

  const overviewItems = Array.isArray(data.overview)
    ? data.overview.map((it: Record<string, unknown>) => ({
        id: toStringValue(it.id),
        title: toStringValue(it.title),
        value: typeof it.value === "number" ? it.value : toStringValue(it.value),
        trend: toStringValue(it.trend),
        trendDirection: toTrendDirection(it.trend_direction ?? it.trendDirection),
        icon: toStringValue(it.icon),
        iconBg: toStringValue(it.icon_bg ?? it.iconBg),
        requiresAttention: Boolean(it.requiresAttention ?? it.requires_attention),
      }))
    : undefined;

  const recentActivitySource = data.recent_activity ?? data.recentActivity;
  const recentActivityItems = Array.isArray(recentActivitySource)
    ? recentActivitySource.map((it: Record<string, unknown>) => ({
        id: toStringValue(it.id),
        type: toStringValue(it.type) as Activity["type"],
        boldLabel: toStringValue(it.bold_label ?? it.boldLabel),
        description: toStringValue(it.description),
        timestamp: toStringValue(it.timestamp),
      }))
    : undefined;

  const upcomingMegaSource = data.upcoming_mega_events ?? data.upcomingMegaEvents;
  const upcomingMegaEvents = Array.isArray(upcomingMegaSource)
    ? upcomingMegaSource.map((it: Record<string, unknown>) => ({
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
      }))
    : undefined;

  return { overviewItems, recentActivityItems, upcomingMegaEvents };
}

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-5 w-28 animate-pulse rounded-full bg-gray-100" />
        <div className="h-8 w-80 max-w-full animate-pulse rounded-full bg-gray-100" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl border border-gray-100 bg-white" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="h-72 animate-pulse rounded-3xl border border-gray-100 bg-white" />
        <div className="h-72 animate-pulse rounded-3xl border border-gray-100 bg-white" />
      </div>
    </div>
  );
}

function DashboardOverviewError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-amber-900">
      <p className="font-semibold">Dashboard data could not be loaded.</p>
      <p className="mt-1 text-amber-800">{message}</p>
    </div>
  );
}

export function DashboardOverviewContent() {
  const dashboardQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => getAnalyticsDashboard("last-8-months"),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });

  const payload = dashboardQuery.data as AnalyticsDashboardPayload | undefined;

  if (dashboardQuery.isLoading) {
    return <DashboardOverviewSkeleton />;
  }

  if (dashboardQuery.isError) {
    return <DashboardOverviewError message="Please try again in a moment." />;
  }

  if (!payload || payload.forbidden || !payload.data) {
    return <DashboardOverviewError message={payload?.message || "You do not have permission to view analytics."} />;
  }

  const { overviewItems, recentActivityItems, upcomingMegaEvents } = mapDashboardData(payload);

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Overview</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor the pulse of AASTU Student Union activities.
        </p>
      </div>

      <PermissionGate anyOf={["analytics.view"]}>
        {overviewItems ? (
          <StatsSection items={overviewItems} className="xl:grid-cols-4" />
        ) : (
          <DashboardOverviewError message="No analytics summary is available for this period." />
        )}
      </PermissionGate>

      <RecentAnnouncements />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <UpcomingEvents items={upcomingMegaEvents} />
        <RecentActivity items={recentActivityItems} />
      </div>

      <DashboardFooter />
    </div>
  );
}
