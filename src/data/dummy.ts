import type {
  Activity,
  BookingStat,
  BookingTab,
  BookingVenueCard,
  BookingVenueFilter,
  ClubDetailItem,
  ClubFilterTab,
  ClubItem,
  Event,
  EventDetailItem,
  EventManagementItem,
  EventManagementStat,
  NavItem,
  StatCard,
  StatsPeriodOption,
  VenueOccupancyPoint,
  VenueStat,
} from "@/types/dashboard";

export const mainNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { id: "announcements", label: "Announcements", href: "/announcements", icon: "Megaphone" },
  { id: "clubs", label: "Clubs", href: "/clubs", icon: "Users" },
  { id: "events", label: "Events", href: "/events", icon: "CalendarDays" },
  { id: "venues", label: "Venues", href: "/venues", icon: "Building2" },
  { id: "bookings", label: "Bookings", href: "/bookings", icon: "BookOpen" },
  { id: "users", label: "Users", href: "/users", icon: "UserCircle" },
  { id: "stats", label: "Stats", href: "/stats", icon: "BarChart3" },
];

export const bottomNavItems: NavItem[] = [
  { id: "settings", label: "Settings", href: "/settings", icon: "Settings" },
  { id: "signout", label: "Sign Out", href: "/sign-out", icon: "LogOut" },
];

export const statsCards: StatCard[] = [
  {
    id: "total-students",
    title: "Total Students",
    value: "0",
    trend: "0%",
    trendDirection: "neutral",
    icon: "GraduationCap",
    iconBg: "#fdf8ec",
  },
  {
    id: "active-clubs",
    title: "Active Clubs",
    value: "0",
    trend: "0%",
    trendDirection: "neutral",
    icon: "Users2",
    iconBg: "#fdf8ec",
  },
  {
    id: "pending-approvals",
    title: "Pending Approvals",
    value: "0",
    trend: "Needs review",
    trendDirection: "neutral",
    icon: "ClipboardList",
    iconBg: "#fdf8ec",
    requiresAttention: true,
  },
];

export const statsPeriods: StatsPeriodOption[] = [
  {
    id: "last-8-months",
    label: "Last 8 Months",
    description: "Enrollment, events, and venue trends across the current cycle.",
  },
  {
    id: "academic-year",
    label: "Academic Year",
    description: "Academic activity snapshot for planning and senate reporting.",
  },
  {
    id: "calendar-year",
    label: "Calendar Year",
    description: "Operational performance from January through December.",
  },
];

export const upcomingEvents: Event[] = [];

export const recentActivities: Activity[] = [];

export const clubFilterTabs: ClubFilterTab[] = [
  { id: "all", label: "All Clubs" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "rejected", label: "Rejected" },
];

export const clubCategoryOptions = [{ value: "all", label: "All Categories" }];

export const eventManagementStats: EventManagementStat[] = [
  {
    id: "total-events",
    title: "Total Events",
    value: "0",
    trend: "0% vs last month",
    icon: "CalendarDays",
  },
  {
    id: "mega-events",
    title: "Mega Events",
    value: "0",
    trend: "Priority Tier",
    icon: "BadgeCheck",
  },
  {
    id: "venue-utilization",
    title: "Venue Utilization",
    value: "0%",
    trend: "0% efficiency",
    icon: "MapPin",
  },
];

export const eventManagementItems: EventManagementItem[] = [];

export const venueOccupancyTrends: VenueOccupancyPoint[] = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

export const eventDetailItems: Record<string, EventDetailItem> = {};

export const venueStats: VenueStat[] = [
  { id: "total-venues", title: "Total Venues", value: "0", icon: "Building2" },
  { id: "active-now", title: "Active Now", value: "0", icon: "CircleCheck" },
  { id: "maintenance", title: "Maintenance", value: "0", icon: "Wrench" },
  { id: "total-capacity", title: "Total Capacity", value: "0", icon: "Users" },
];

export const clubItems: ClubItem[] = [];

export const clubDetailItems: Record<string, ClubDetailItem> = {};

export const bookingTabs: BookingTab[] = [
  { id: "browse-venues", label: "Browse Venues" },
  { id: "my-bookings", label: "My Bookings" },
  { id: "approval-queue", label: "Approval Queue", showAdminBadge: true },
];

export const bookingStats: BookingStat[] = [
  { id: "total", title: "Total Bookings", value: "0", icon: "BookOpenCheck", accent: "navy" },
  { id: "pending", title: "Pending", value: "0", icon: "Clock3", accent: "gold" },
  { id: "approved", title: "Approved", value: "0", icon: "BadgeCheck", accent: "green" },
  { id: "cancelled", title: "Cancelled", value: "0", icon: "XCircle", accent: "red" },
];

export const bookingVenueFilters: BookingVenueFilter[] = [{ id: "all", label: "All Venues" }];

export const bookingVenueCards: BookingVenueCard[] = [];
