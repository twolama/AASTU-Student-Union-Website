import type {
  NavItem,
  StatCard,
  Event,
  Activity,
  AdminUser,
  AnnouncementTab,
  AnnouncementItem,
  AnnouncementPreviewData,
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

export const announcementPreviewData: Record<string, AnnouncementPreviewData> = {
  "ann-1": {
    id: "ann-1",
    title: "New Semester Registration Guidelines: Academic Year 2023/24",
    subtitleBadge: "Important Update",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1400&auto=format&fit=crop",
    authorName: "AASTU ICT Club Coordinator",
    authorRole: "Registrar Office",
    publishedDate: "Oct 24, 2023",
    readTime: "4 min read",
    introText:
      "Attention all students! The registration process for the upcoming semester has been streamlined to improve efficiency and reduce wait times. Please read the following instructions carefully.",
    timelineHeading: "Registration Timeline",
    timelineText:
      "Regular registration will begin on Monday, November 6th and conclude on Friday, November 10th. Students who miss this window will be subject to a late registration fee as per university policy.",
    keyRequirements: [
      "Cleared financial statements for the previous academic year.",
      "Updated medical insurance documentation.",
      "Valid Student ID card for scanning at the Registrar.",
    ],
    procedureSteps: [
      "Online Pre-Registration: Log into the AASTU student portal using your credentials and navigate to the Academic section.",
      "Departmental Approval: Visit your department head with a printed copy of your pre-registration form for academic advising and signature.",
      "Final Verification: Submit signed documents to the Registrar office located in Block 5, 2nd Floor.",
    ],
    supportNote:
      "If you encounter technical difficulties during the online phase, contact ICT Support Center or visit the help desk in the library basement.",
    tags: ["#AcademicUpdate", "#Registrar", "#Fall2023"],
  },
  "ann-2": {
    id: "ann-2",
    title: "Annual Cultural Night 2024",
    subtitleBadge: "Social Events",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&fit=crop",
    authorName: "Events Committee",
    authorRole: "AASTU Student Union",
    publishedDate: "Nov 02, 2024",
    readTime: "3 min read",
    introText:
      "Join us for a colorful night of music, dance, and celebration of campus diversity. Students from all departments are invited to attend and participate.",
    timelineHeading: "Event Timeline",
    timelineText:
      "Doors open at 4:30 PM with cultural booths and exhibitions. Stage performances begin at 6:00 PM and continue until 9:30 PM.",
    keyRequirements: [
      "Carry your valid student ID.",
      "Register your group performance before Wednesday.",
      "Follow event safety and seating guidelines.",
    ],
    procedureSteps: [
      "Collect your participation ticket from the Student Union office.",
      "Arrive at the Main Hall at least 30 minutes early.",
      "Check in with your department coordinator before entering.",
    ],
    supportNote:
      "For coordination support, reach the Events Committee desk near the Main Hall entrance.",
    tags: ["#CulturalNight", "#StudentLife", "#AASTU"],
  },
  "ann-3": {
    id: "ann-3",
    title: "Student Council Monthly Meeting",
    subtitleBadge: "Union Meetings",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&auto=format&fit=crop",
    authorName: "SU President",
    authorRole: "Student Council",
    publishedDate: "Sep 15, 2024",
    readTime: "5 min read",
    introText:
      "This month’s council meeting will focus on student facilities, semester feedback, and strategic plans for the next quarter.",
    timelineHeading: "Meeting Agenda",
    timelineText:
      "The meeting will be held on Friday at 2:00 PM in Senate Room B. Department delegates are expected to present key feedback from students.",
    keyRequirements: [
      "Department representatives must attend.",
      "Bring previous meeting action reports.",
      "Submit agenda proposals before noon Thursday.",
    ],
    procedureSteps: [
      "Confirm attendance through your department chair.",
      "Prepare concise agenda points.",
      "Submit finalized minutes within 24 hours after meeting.",
    ],
    supportNote:
      "Contact the council secretariat for meeting materials and attendance confirmations.",
    tags: ["#StudentCouncil", "#Union", "#CampusPlanning"],
  },
};
