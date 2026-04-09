// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string; // lucide icon name
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────
export type TrendDirection = "up" | "down" | "neutral";

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  trend: string;
  trendDirection: TrendDirection;
  icon: string; // lucide icon name
  iconBg: string; // Tailwind bg class or hex
  requiresAttention?: boolean;
}

// ─── Events ───────────────────────────────────────────────────────────────────
export interface Attendee {
  id: string;
  avatarUrl?: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  venue: string;
  imageUrl: string;
  dateLabel: string; // e.g. "OCT 15"
  attendeeCount: number;
  attendees: Attendee[];
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
export type ActivityType = "club" | "approval" | "student" | "alert" | "info";

export interface Activity {
  id: string;
  type: ActivityType;
  boldLabel: string;
  description: string;
  timestamp: string; // e.g. "2 hours ago"
}

// ─── Announcements ───────────────────────────────────────────────────────────
export type AnnouncementCategory = "academic" | "social" | "union";

export interface AnnouncementTab {
  id: string;
  label: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: AnnouncementCategory;
  publishedAgo: string;
  authorName: string;
}

export interface AnnouncementPreviewData {
  id: string;
  title: string;
  subtitleBadge: string;
  imageUrl: string;
  authorName: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  introText: string;
  timelineHeading: string;
  timelineText: string;
  keyRequirements: string[];
  procedureSteps: string[];
  supportNote: string;
  tags: string[];
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface AdminUser {
  name: string;
  role: string;
  avatarUrl?: string;
}
