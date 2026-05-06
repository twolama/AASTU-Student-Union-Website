import type { EventManagementStatus } from "@/types/dashboard";

type EventStatusSource = {
  status?: string | null;
  start_date_time?: string | null;
  end_date_time?: string | null;
  is_archived?: boolean | null;
};

const STATUS_LABELS: Record<EventManagementStatus, string> = {
  upcoming: "Upcoming",
  "live-now": "Happening Now",
  archived: "Past Event",
};

const STATUS_VARIANTS: Record<EventManagementStatus, "info" | "success" | "default"> = {
  upcoming: "info",
  "live-now": "success",
  archived: "default",
};

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function resolveEventStatus(event: EventStatusSource, now: Date = new Date()): EventManagementStatus {
  if (event.is_archived) {
    return "archived";
  }

  // Allow manual override only for live-now.
  // Manual archiving should use the is_archived flag.
  if (event.status === "live-now") {
    return "live-now";
  }

  const start = parseDate(event.start_date_time);
  const end = parseDate(event.end_date_time);

  if (start && now < start) {
    return "upcoming";
  }

  if (end && now >= end) {
    return "archived";
  }

  if (start && (!end || now >= start)) {
    return "live-now";
  }

  if (end && now < end) {
    return "live-now";
  }

  return (event.status as EventManagementStatus) || "upcoming";
}

export function getEventStatusLabel(status: string): string {
  return STATUS_LABELS[status as EventManagementStatus] ?? "Upcoming";
}

export function getEventStatusVariant(status: string): "info" | "success" | "default" {
  return STATUS_VARIANTS[status as EventManagementStatus] ?? "info";
}
