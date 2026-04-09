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

// ─── Clubs ───────────────────────────────────────────────────────────────────
export type ClubStatus = "active" | "pending" | "rejected";

export interface ClubStat {
  id: string;
  title: string;
  value: string;
  icon: string;
}

export interface ClubFilterTab {
  id: "all" | "active" | "pending" | "rejected";
  label: string;
}

export interface ClubItem {
  id: string;
  name: string;
  categoryLabel: string;
  status: ClubStatus;
  presidentName: string;
  advisorName: string;
  headerGradient: string;
  logoLabel: string;
}

export interface ClubDetailStat {
  id: string;
  label: string;
  value: string;
}

export interface ClubMemberProfile {
  id: string;
  roleLabel: string;
  name: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  initials: string;
}

export interface ClubUpcomingEventItem {
  id: string;
  day: string;
  month: string;
  title: string;
  timeVenue: string;
}

export interface ClubActivityItem {
  id: string;
  timestamp: string;
  description: string;
}

export interface ClubDetailItem {
  id: string;
  name: string;
  status: ClubStatus;
  categoryLabel: string;
  locationLabel: string;
  logoLabel: string;
  coverImageUrl: string;
  about: string[];
  stats: ClubDetailStat[];
  links: {
    website: string;
    externalMembership: string;
  };
  contacts: ClubMemberProfile[];
  upcomingEvents: ClubUpcomingEventItem[];
  recentActivities: ClubActivityItem[];
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface AdminUser {
  name: string;
  role: string;
  avatarUrl?: string;
}
