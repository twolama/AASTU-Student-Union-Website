import type {
  NavItem,
  StatCard,
  Event,
  Activity,
  AdminUser,
  AnnouncementTab,
  AnnouncementItem,
} from "@/types/dashboard";

// ─── Current User ──────────────────────────────────────────────────────────────
export const currentUser: AdminUser = {
  name: "Abebe Kebede",
  role: "Super Admin",
  avatarUrl: undefined,
};

// ─── Navigation Items ──────────────────────────────────────────────────────────
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

// ─── Stats Cards ───────────────────────────────────────────────────────────────
export const statsCards: StatCard[] = [
  {
    id: "total-students",
    title: "Total Students",
    value: "12,450",
    trend: "+2.1% from last semester",
    trendDirection: "up",
    icon: "GraduationCap",
    iconBg: "#fdf8ec",
  },
  {
    id: "active-clubs",
    title: "Active Clubs",
    value: "42",
    trend: "+4 new this month",
    trendDirection: "up",
    icon: "Users2",
    iconBg: "#fdf8ec",
  },
  {
    id: "pending-approvals",
    title: "Pending Approvals",
    value: "15",
    trend: "Requires attention",
    trendDirection: "neutral",
    icon: "ClipboardList",
    iconBg: "#fdf8ec",
    requiresAttention: true,
  },
];

// ─── Upcoming Events ───────────────────────────────────────────────────────────
export const upcomingEvents: Event[] = [
  {
    id: "campus-tech-expo",
    title: "Campus Tech Expo 2024",
    venue: "Central Auditorium",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop",
    dateLabel: "OCT 15",
    attendeeCount: 200,
    attendees: [
      { id: "a1", name: "Mekdes Alemu", avatarUrl: undefined },
      { id: "a2", name: "Yonas Tesfaye", avatarUrl: undefined },
      { id: "a3", name: "Hana Girma", avatarUrl: undefined },
    ],
  },
  {
    id: "annual-talent-fest",
    title: "Annual Talent Fest",
    venue: "Student Lounge",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop",
    dateLabel: "NOV 02",
    attendeeCount: 450,
    attendees: [
      { id: "b1", name: "Biruk Tadesse", avatarUrl: undefined },
      { id: "b2", name: "Selam Bekele", avatarUrl: undefined },
      { id: "b3", name: "Abel Hailu", avatarUrl: undefined },
    ],
  },
];

// ─── Recent Activity ───────────────────────────────────────────────────────────
export const recentActivities: Activity[] = [
  {
    id: "act-1",
    type: "club",
    boldLabel: "New Club Application",
    description: "Robotics & AI Club submitted for review.",
    timestamp: "2 hours ago",
  },
  {
    id: "act-2",
    type: "approval",
    boldLabel: "Approval Granted",
    description: "'Engineering Social' budget approved.",
    timestamp: "5 hours ago",
  },
  {
    id: "act-3",
    type: "student",
    boldLabel: "Student Registration",
    description: "12 new freshman students added.",
    timestamp: "Yesterday",
  },
  {
    id: "act-4",
    type: "alert",
    boldLabel: "System Alert",
    description: "Event 'Freshman Welcoming' capacity reached.",
    timestamp: "Yesterday",
  },
];

// ─── Announcements ───────────────────────────────────────────────────────────
export const announcementTabs: AnnouncementTab[] = [
  { id: "all", label: "All Announcements" },
  { id: "academic", label: "Academic Updates" },
  { id: "social", label: "Social Events" },
  { id: "union", label: "Union Meetings" },
];

export const announcementItems: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Final Examination Schedule Released",
    summary:
      "The official schedule for the Semester II final examinations is now available for all departments. Please review the updated venues and time slots on the student portal.",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&auto=format&fit=crop",
    category: "academic",
    publishedAgo: "Published 2 hours ago",
    authorName: "Registrar Office",
  },
  {
    id: "ann-2",
    title: "Annual Cultural Night 2024",
    summary:
      "Join us for a night of diversity and talent. The Annual Cultural Night is happening this Friday at the Main Hall. Tickets are available at the Student Union office starting today.",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop",
    category: "social",
    publishedAgo: "Published yesterday",
    authorName: "Events Committee",
  },
  {
    id: "ann-3",
    title: "Student Council Monthly Meeting",
    summary:
      "The next general meeting will discuss the upcoming campus facility renovations. All student representatives are required to attend. Minutes from the previous meeting are attached.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop",
    category: "union",
    publishedAgo: "3 days ago",
    authorName: "SU President",
  },
];
