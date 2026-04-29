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

export type StatsRangeId = "last-8-months" | "academic-year" | "calendar-year";

export interface StatsPeriodOption {
  id: StatsRangeId;
  label: string;
  description: string;
}

export interface StatsTrendPoint {
  label: string;
  value: number;
}

export interface StatsBreakdownItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface StatsReportItem {
  id: string;
  title: string;
  meta: string;
  format: string;
  size: string;
  duration: string;
  icon: string;
  accent: string;
}

export interface StatsInsightItem {
  id: string;
  title: string;
  description: string;
  value: string;
  tone: "positive" | "neutral" | "warning";
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

export type EventManagementStatus = "live-now" | "upcoming" | "archived";

export interface EventManagementStat {
  id: string;
  title: string;
  value: string;
  trend: string;
  icon: string;
}

export interface EventManagementItem {
  id: string;
  title: string;
  organizingClub: string;
  venue: string;
  scheduleDate: string;
  scheduleTime: string;
  status: EventManagementStatus;
  maxCapacity?: number;
}

export interface VenueOccupancyPoint {
  day: string;
  value: number;
}

export interface EventLogisticsPoint {
  id: string;
  label: string;
  value: string;
}

export interface EventDetailItem {
  id: string;
  title: string;
  summary: string;
  status: EventManagementStatus;
  megaEvent: boolean;
  coverImageUrl: string;
  dateDay: string;
  dateMonth: string;
  venueTitle: string;
  venueSubtitle: string;
  timeRange: string;
  startDateLabel: string;
  locationName: string;
  locationWing: string;
  aboutParagraphs: string[];
  attendance: {
    current: number;
    capacity: number;
    waitlist: number;
    vips: number;
  };
  organizingClub: {
    clubId: string;
    name: string;
    subtitle: string;
  };
  logistics: EventLogisticsPoint[];
  mapImageUrl: string;
}

// ─── Venues ──────────────────────────────────────────────────────────────────
export type VenueStatus = "active" | "maintenance" | "inactive";

export interface VenueStat {
  id: string;
  title: string;
  value: string;
  icon: string;
}

export interface VenueItem {
  id: string;
  name: string;
  typeLabel: string;
  imageUrl: string;
  location: string;
  locationHint: string;
  capacityLabel: string;
  status: VenueStatus;
}

export interface VenueScheduleItem {
  id: string;
  day: string;
  month: string;
  title: string;
  timeRange: string;
  organizer: string;
  status: "confirmed" | "pending";
}

export interface VenueDetailItem {
  id: string;
  name: string;
  subtitle: string;
  status: VenueStatus;
  locationLabel: string;
  capacityLabel: string;
  coverImageUrl: string;
  logoLabel: string;
  overview: string[];
  gallery: string[];
  amenities: string[];
  upcomingSchedule?: VenueScheduleItem[];
  mapImageUrl: string;
  gettingThere: string;
  contact: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
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
export type AnnouncementCategory = string;

export interface AnnouncementTab {
  id: string;
  label: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body_excerpt: string;
  imageUrl: string;
  category: AnnouncementCategory;
  publishedAgo: string;
  authorName: string;
  isPinned?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  shortDescription: string;
  status: string;
  megaEvent: boolean;
  archived: boolean;
  maxCapacity: number;
  imageUrl: string;
  clubName: string;
  venueName: string;
  startDateTime: string;
  endDateTime: string;
  dateDay: string;
  dateMonth: string;
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
  logo?: string | null;
  coverImage?: string | null;
  departmentId?: string;
  departmentName?: string;
  description?: string;
  memberCount?: number;
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
  avatarUrl?: string | null;
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
  departmentLabel?: string;
  departmentId?: string;
  logoLabel: string;
  logo?: string | null;
  coverImageUrl: string;
  about: string[];
  stats: ClubDetailStat[];
  links: {
    website: string;
    membership: string;
    telegram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  contacts: ClubMemberProfile[];
  upcomingEvents: ClubUpcomingEventItem[];
  recentActivities: ClubActivityItem[];
}

// ─── Bookings ───────────────────────────────────────────────────────────────
export type BookingTabId = "browse-venues" | "my-bookings" | "approval-queue";

export interface BookingTab {
  id: BookingTabId;
  label: string;
  showAdminBadge?: boolean;
  badge?: string | number;
}

export interface BookingStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  accent: "navy" | "gold" | "green" | "red";
}

export type BookingVenueStatus = "available" | "blocked";

export interface BookingVenueFilter {
  id: string;
  label: string;
}

export interface BookingVenueCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  capacity: number;
  category: string;
  status: BookingVenueStatus;
  amenities: string[];
}

export type BookingStatus = "pending" | "approved" | "cancelled";

export interface MyBookingItem {
  id: string;
  venueName: string;
  eventTitle: string;
  dateLabel: string;
  timeLabel: string;
  status: BookingStatus;
}

export type BookingRequestDateRange = "next-7-days" | "next-14-days" | "this-month" | "all";

export interface BookingRequestItem {
  id: string;
  requesterName: string;
  clubName: string;
  venueName: string;
  capacityLabel: string;
  dateLabel: string;
  timeRange: string;
  purpose: string;
  venueType: string;
  requestedDateIso: string;
  requesterAvatarUrl?: string;
  status: BookingStatus;
}

export interface BookingDetailAvailabilityDay {
  dayLabel: string;
  date: string;
  active?: boolean;
  busy?: boolean;
}

export interface BookingDetailUpcomingEvent {
  id: string;
  dateLabel: string;
  timeLabel: string;
  title: string;
}

export interface BookingDetailSimilarVenue {
  id: string;
  tag: string;
  name: string;
  capacity: number;
  location: string;
  imageUrl: string;
}

export interface BookingDetailItem {
  id: string;
  venueSelectionId: string;
  isBookable: boolean;
  venueIdLabel: string;
  availabilityLabel: string;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  gallery: string[];
  aboutParagraphs: string[];
  capacityLabel: string;
  levelLabel: string;
  amenities: string[];
  locationTitle: string;
  locationAddress: string;
  locationMapImageUrl: string;
  availabilityMonthLabel: string;
  availabilityDays: BookingDetailAvailabilityDay[];
  upcomingEvents: BookingDetailUpcomingEvent[];
  similarVenues: BookingDetailSimilarVenue[];
}

// ─── Users Management ───────────────────────────────────────────────────────
export type UserManagementRole = "su-admin" | "club-president" | "general-student";

export interface UserManagementStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  accent: "navy" | "gold" | "slate";
}

export interface UserManagementItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  studentId: string;
  department: string;
  role: UserManagementRole;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface AdminUser {
  name: string;
  role: string;
  avatarUrl?: string;
}
