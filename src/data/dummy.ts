import type {
  NavItem,
  StatCard,
  Event,
  Activity,
  AdminUser,
  AnnouncementTab,
  AnnouncementItem,
  AnnouncementPreviewData,
  ClubStat,
  ClubFilterTab,
  ClubItem,
  ClubDetailItem,
  EventManagementStat,
  EventManagementItem,
  VenueOccupancyPoint,
  EventDetailItem,
  VenueStat,
  VenueItem,
  VenueDetailItem,
  BookingTab,
  BookingStat,
  BookingVenueFilter,
  BookingVenueCard,
  MyBookingItem,
  BookingRequestItem,
  BookingDetailItem,
  UserManagementStat,
  UserManagementItem,
  StatsPeriodOption,
  StatsRangeId,
  StatsTrendPoint,
  StatsBreakdownItem,
  StatsReportItem,
  StatsInsightItem,
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

export const statsOverviewCards: StatCard[] = [
  {
    id: "overview-students",
    title: "Total Students",
    value: "1,240",
    trend: "+5.2% from the previous cycle",
    trendDirection: "up",
    icon: "GraduationCap",
    iconBg: "#fdf8ec",
  },
  {
    id: "overview-clubs",
    title: "Active Clubs",
    value: "48",
    trend: "+2.1% from last semester",
    trendDirection: "up",
    icon: "Users2",
    iconBg: "#fdf8ec",
  },
  {
    id: "overview-events",
    title: "Monthly Events",
    value: "24",
    trend: "+12.5% from last month",
    trendDirection: "up",
    icon: "CalendarDays",
    iconBg: "#fdf8ec",
  },
  {
    id: "overview-bookings",
    title: "Total Venue Bookings",
    value: "156",
    trend: "+8.4% from last month",
    trendDirection: "up",
    icon: "Building2",
    iconBg: "#fdf8ec",
  },
];

export const statsRegistrationTrends: Record<StatsRangeId, StatsTrendPoint[]> = {
  "last-8-months": [
    { label: "Jan", value: 58 },
    { label: "Feb", value: 72 },
    { label: "Mar", value: 68 },
    { label: "Apr", value: 91 },
    { label: "May", value: 112 },
    { label: "Jun", value: 118 },
    { label: "Jul", value: 129 },
    { label: "Aug", value: 142 },
  ],
  "academic-year": [
    { label: "Q1", value: 110 },
    { label: "Q2", value: 138 },
    { label: "Q3", value: 151 },
    { label: "Q4", value: 167 },
  ],
  "calendar-year": [
    { label: "H1", value: 244 },
    { label: "H2", value: 291 },
  ],
};

export const statsVenueOccupancyTrends: Record<StatsRangeId, StatsTrendPoint[]> = {
  "last-8-months": [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 51 },
    { label: "Mar", value: 58 },
    { label: "Apr", value: 64 },
    { label: "May", value: 59 },
    { label: "Jun", value: 72 },
    { label: "Jul", value: 81 },
    { label: "Aug", value: 76 },
  ],
  "academic-year": [
    { label: "Q1", value: 56 },
    { label: "Q2", value: 61 },
    { label: "Q3", value: 69 },
    { label: "Q4", value: 74 },
  ],
  "calendar-year": [
    { label: "H1", value: 57 },
    { label: "H2", value: 70 },
  ],
};

export const statsClubBreakdown: StatsBreakdownItem[] = [
  { id: "technology", label: "Technology & Innovation", value: 42, color: "#c49a22" },
  { id: "arts", label: "Arts & Culture", value: 24, color: "#1f2a44" },
  { id: "sports", label: "Sports & Health", value: 18, color: "#7d8ca8" },
  { id: "service", label: "Social Service", value: 16, color: "#d4b45c" },
];

export const statsEventDistribution: StatsBreakdownItem[] = [
  { id: "general", label: "General", value: 18, color: "#1f2a44" },
  { id: "mega", label: "Mega", value: 6, color: "#c49a22" },
];

export const statsReports: StatsReportItem[] = [
  {
    id: "monthly-performance",
    title: "Monthly Performance",
    meta: "PDF • 2.4 MB • 2H AGO",
    format: "PDF",
    size: "2.4 MB",
    duration: "2H AGO",
    icon: "FileText",
    accent: "#ef4444",
  },
  {
    id: "club-registry",
    title: "Club Registry Data",
    meta: "CSV • 1.1 MB • 1D AGO",
    format: "CSV",
    size: "1.1 MB",
    duration: "1D AGO",
    icon: "FileSpreadsheet",
    accent: "#22c55e",
  },
  {
    id: "venue-usage",
    title: "Venue Usage Audit",
    meta: "XLSX • 840 KB • 4H AGO",
    format: "XLSX",
    size: "840 KB",
    duration: "4H AGO",
    icon: "BarChart3",
    accent: "#3b82f6",
  },
];

export const statsInsights: StatsInsightItem[] = [
  {
    id: "growth",
    title: "Enrollment growth remains steady",
    description: "Admissions-driven growth is strongest in April through August, with a sustained upward trend.",
    value: "+5.2%",
    tone: "positive",
  },
  {
    id: "occupancy",
    title: "Venue demand peaks midweek",
    description: "Auditorium and workshop spaces see the highest usage on Tuesday and Thursday blocks.",
    value: "72% peak",
    tone: "neutral",
  },
  {
    id: "events",
    title: "Mega events need advance planning",
    description: "Mega events still make up a smaller portion of the calendar but require the most lead time.",
    value: "6 events",
    tone: "warning",
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

// ─── Clubs ───────────────────────────────────────────────────────────────────
export const clubStats: ClubStat[] = [
  { id: "total", title: "Total Clubs", value: "42", icon: "Users" },
  { id: "pending", title: "Pending Approvals", value: "08", icon: "Clock3" },
  { id: "categories", title: "Active Categories", value: "12", icon: "Layers3" },
];

export const clubFilterTabs: ClubFilterTab[] = [
  { id: "all", label: "All Clubs" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "rejected", label: "Rejected" },
];

export const clubCategoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "arts-culture", label: "Arts & Culture" },
  { value: "sports", label: "Sports" },
  { value: "social-service", label: "Social Service" },
];

export const clubItems: ClubItem[] = [
  {
    id: "club-1",
    name: "AASTU Google DSC",
    categoryLabel: "Technology",
    status: "active",
    presidentName: "Abel Tadesse",
    advisorName: "Dr. Elias M.",
    headerGradient: "from-[#2f3d67] to-[#3d4e7f]",
    logoLabel: "G",
  },
  {
    id: "club-2",
    name: "Literature Society",
    categoryLabel: "Arts & Culture",
    status: "pending",
    presidentName: "Martha Solomon",
    advisorName: "W/ro Selamawit G.",
    headerGradient: "from-[#b38f2b] to-[#c8a13b]",
    logoLabel: "L",
  },
  {
    id: "club-3",
    name: "AASTU FC",
    categoryLabel: "Sports",
    status: "active",
    presidentName: "Dawit Yohannes",
    advisorName: "Ato Samuel K.",
    headerGradient: "from-[#0e1b37] to-[#1c2a4e]",
    logoLabel: "F",
  },
  {
    id: "club-4",
    name: "Gaming Alliance",
    categoryLabel: "Social Service",
    status: "rejected",
    presidentName: "Bereket Kebede",
    advisorName: "Not Assigned",
    headerGradient: "from-[#864040] to-[#a04f4f]",
    logoLabel: "G",
  },
];

export const clubDetailItems: Record<string, ClubDetailItem> = {
  "club-1": {
    id: "club-1",
    name: "AASTU Robotics & AI Club",
    status: "active",
    categoryLabel: "Academic & Technology",
    locationLabel: "Main Campus, Block 24",
    logoLabel: "R",
    coverImageUrl:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1600&auto=format&fit=crop",
    about: [
      "The AASTU Robotics & AI Club is a vibrant community of innovators dedicated to exploring the boundaries of automation and intelligence.",
      "Founded in 2018, the club provides a platform for students to engage in hands-on projects, from autonomous drones to neural network applications.",
      "Its mission is to foster technological excellence at AASTU by preparing students through competitions, workshops, and industry collaboration.",
    ],
    stats: [
      { id: "members", label: "Total Members", value: "156" },
      { id: "events", label: "Events Hosted", value: "24" },
      { id: "rank", label: "Campus Ranking", value: "#04" },
    ],
    links: {
      website: "https://ieeerobotics.example.org/aastu",
      externalMembership: "https://ieeerobotics.example.org/club/aastu-robotics",
    },
    contacts: [
      {
        id: "president",
        roleLabel: "Club President",
        name: "John Doe",
        subtitle: "Software Engineering, 4th Year",
        email: "j.doe@aastu.edu.et",
        phone: "+251 912 345 678",
        location: "Block 24, Room 08",
        initials: "JD",
      },
      {
        id: "advisor",
        roleLabel: "Club Advisor",
        name: "Dr. Birhanu Alemu",
        subtitle: "Department of Electrical Engineering",
        email: "birhanu.alemu@aastu.edu.et",
        phone: "+251 911 564 230",
        location: "Block 6, Room 102",
        initials: "BA",
      },
    ],
    upcomingEvents: [
      {
        id: "evt-1",
        month: "OCT",
        day: "24",
        title: "AI Bootcamp 2024",
        timeVenue: "09:00 AM · Main Hall",
      },
      {
        id: "evt-2",
        month: "NOV",
        day: "02",
        title: "Robo-Race Competition",
        timeVenue: "02:30 PM · Gym Arena",
      },
    ],
    recentActivities: [
      {
        id: "ra-1",
        timestamp: "2 days ago",
        description: "Updated club description and added new projects.",
      },
      {
        id: "ra-2",
        timestamp: "1 week ago",
        description: "Added 12 new members from the freshman batch.",
      },
    ],
  },
  "club-2": {
    id: "club-2",
    name: "Literature Society",
    status: "pending",
    categoryLabel: "Arts & Culture",
    locationLabel: "Library Wing, Block 3",
    logoLabel: "L",
    coverImageUrl:
      "https://images.unsplash.com/photo-1455885666463-9c6f5f7122c5?w=1600&auto=format&fit=crop",
    about: [
      "Literature Society nurtures critical thinking and creative writing through reading circles, critique sessions, and author discussions.",
    ],
    stats: [
      { id: "members", label: "Total Members", value: "68" },
      { id: "events", label: "Events Hosted", value: "11" },
      { id: "rank", label: "Campus Ranking", value: "#09" },
    ],
    links: {
      website: "https://aastu-literature.example.org",
      externalMembership: "https://writers-foundation.example.org/join/aastu",
    },
    contacts: [
      {
        id: "president",
        roleLabel: "Club President",
        name: "Martha Solomon",
        subtitle: "Applied Linguistics, 3rd Year",
        email: "m.solomon@aastu.edu.et",
        phone: "+251 921 112 233",
        location: "Block 3, Room 14",
        initials: "MS",
      },
      {
        id: "advisor",
        roleLabel: "Club Advisor",
        name: "W/ro Selamawit G.",
        subtitle: "Department of Social Sciences",
        email: "selamawit.g@aastu.edu.et",
        phone: "+251 911 223 344",
        location: "Block 2, Room 11",
        initials: "SG",
      },
    ],
    upcomingEvents: [
      {
        id: "evt-1",
        month: "OCT",
        day: "18",
        title: "Open Mic Poetry Night",
        timeVenue: "05:00 PM · Student Lounge",
      },
    ],
    recentActivities: [
      {
        id: "ra-1",
        timestamp: "3 days ago",
        description: "Submitted revised advisor documentation.",
      },
    ],
  },
  "club-3": {
    id: "club-3",
    name: "AASTU FC",
    status: "active",
    categoryLabel: "Sports",
    locationLabel: "Main Field Complex",
    logoLabel: "F",
    coverImageUrl:
      "https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=1600&auto=format&fit=crop",
    about: [
      "AASTU FC is the university's flagship football club focused on competitive performance, sportsmanship, and student wellness.",
      "The club runs year-round training cycles, inter-campus tournaments, and mentoring sessions for first-year athletes.",
      "Beyond competition, AASTU FC promotes leadership and discipline through team culture and community outreach.",
    ],
    stats: [
      { id: "members", label: "Total Members", value: "94" },
      { id: "events", label: "Matches Played", value: "31" },
      { id: "rank", label: "Campus Ranking", value: "#02" },
    ],
    links: {
      website: "https://aastu-fc.example.org",
      externalMembership: "https://sports.example.org/clubs/aastu-fc",
    },
    contacts: [
      {
        id: "president",
        roleLabel: "Club President",
        name: "Dawit Yohannes",
        subtitle: "Civil Engineering, 4th Year",
        email: "d.yohannes@aastu.edu.et",
        phone: "+251 913 440 220",
        location: "Sports Center, Office 4",
        initials: "DY",
      },
      {
        id: "advisor",
        roleLabel: "Club Advisor",
        name: "Ato Samuel K.",
        subtitle: "University Sports Department",
        email: "samuel.k@aastu.edu.et",
        phone: "+251 911 440 220",
        location: "Sports Department, Block 1",
        initials: "SK",
      },
    ],
    upcomingEvents: [
      {
        id: "evt-1",
        month: "MAY",
        day: "12",
        title: "Inter-Faculty Championship Final",
        timeVenue: "04:00 PM · Main Field",
      },
      {
        id: "evt-2",
        month: "JUN",
        day: "03",
        title: "Open Tryouts - New Season",
        timeVenue: "08:00 AM · Stadium Annex",
      },
    ],
    recentActivities: [
      {
        id: "ra-1",
        timestamp: "1 day ago",
        description: "Published training roster for the upcoming week.",
      },
      {
        id: "ra-2",
        timestamp: "5 days ago",
        description: "Won quarter-final match in the inter-campus league.",
      },
    ],
  },
};

// ─── Events Management ───────────────────────────────────────────────────────
export const eventManagementStats: EventManagementStat[] = [
  {
    id: "total-events",
    title: "Total Events",
    value: "128",
    trend: "+12% vs last month",
    icon: "CalendarDays",
  },
  {
    id: "mega-events",
    title: "Mega Events",
    value: "12",
    trend: "Priority Tier",
    icon: "BadgeCheck",
  },
  {
    id: "venue-utilization",
    title: "Venue Utilization",
    value: "84%",
    trend: "+5.2% efficiency",
    icon: "MapPin",
  },
];

export const eventManagementItems: EventManagementItem[] = [
  {
    id: "event-1",
    title: "Tech-Quest Hackathon 2024",
    organizingClub: "Google DSC AASTU",
    venue: "Grand Library Hall",
    scheduleDate: "Oct 24, 2024",
    scheduleTime: "09:00 AM - 05:00 PM",
    status: "live-now",
  },
  {
    id: "event-2",
    title: "Cultural Arts Festival",
    organizingClub: "AASTU Arts Club",
    venue: "Outdoor Plaza",
    scheduleDate: "Nov 02, 2024",
    scheduleTime: "02:00 PM",
    status: "upcoming",
  },
  {
    id: "event-3",
    title: "Stem-Expo 2024",
    organizingClub: "Robotics Society",
    venue: "Block 54 Auditorium",
    scheduleDate: "Sep 15, 2024",
    scheduleTime: "Closed",
    status: "archived",
  },
  {
    id: "event-4",
    title: "Leadership Summit",
    organizingClub: "Rotaract AASTU",
    venue: "ICT Center Seminar Room",
    scheduleDate: "Dec 12, 2024",
    scheduleTime: "10:00 AM",
    status: "upcoming",
  },
  {
    id: "event-5",
    title: "Women in Engineering Meetup",
    organizingClub: "IEEE Women Chapter",
    venue: "Innovation Hub",
    scheduleDate: "Jan 09, 2025",
    scheduleTime: "01:30 PM",
    status: "upcoming",
  },
  {
    id: "event-6",
    title: "Campus Wellness Week",
    organizingClub: "Health & Wellness Club",
    venue: "Student Lounge",
    scheduleDate: "Feb 03, 2025",
    scheduleTime: "08:30 AM",
    status: "live-now",
  },
  {
    id: "event-7",
    title: "Green Campus Campaign",
    organizingClub: "Eco Action Team",
    venue: "Main Quadrant",
    scheduleDate: "Mar 14, 2025",
    scheduleTime: "11:00 AM",
    status: "upcoming",
  },
  {
    id: "event-8",
    title: "Debate Championship Finals",
    organizingClub: "Debate Society",
    venue: "Senate Hall",
    scheduleDate: "Apr 22, 2025",
    scheduleTime: "03:00 PM",
    status: "archived",
  },
];

export const venueOccupancyTrends: VenueOccupancyPoint[] = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 62 },
  { day: "Wed", value: 46 },
  { day: "Thu", value: 84 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 25 },
  { day: "Sun", value: 20 },
];

export const eventDetailItems: Record<string, EventDetailItem> = {
  "event-1": {
    id: "event-1",
    title: "Mega Tech Expo 2024",
    summary:
      "The most anticipated annual technology and innovation showcase featuring projects from across all engineering departments.",
    status: "upcoming",
    megaEvent: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop",
    dateDay: "24",
    dateMonth: "Oct",
    venueTitle: "AASTU Grand Auditorium",
    venueSubtitle: "Kilinto, Addis Ababa",
    timeRange: "09:00 AM - 05:30 PM",
    startDateLabel: "Starts Thu, Oct 24, 2024",
    locationName: "Block 54, Room 201",
    locationWing: "North Campus Wing",
    aboutParagraphs: [
      "The Mega Tech Expo is the signature event of the AASTU Student Union, bringing together over 500 participants and 50+ innovative projects.",
      "This year, we focus on Sustainable Engineering and AI applications in the Ethiopian context.",
      "Attendees can expect keynote speeches from industry leaders, live coding sessions, robotics demonstrations, and a career fair featuring top local tech firms.",
    ],
    attendance: {
      current: 342,
      capacity: 500,
      waitlist: 12,
      vips: 25,
    },
    organizingClub: {
      clubId: "club-1",
      name: "Engineering Society",
      subtitle: "Since 2018 · 120 Members",
    },
    logistics: [
      { id: "venue", label: "Venue Name", value: "Main Auditorium (B-01)" },
      { id: "coordinates", label: "Coordinates", value: "8.8920° N, 38.8055° E" },
      { id: "team", label: "Team Required", value: "15 Volunteers assigned" },
    ],
    mapImageUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop",
  },
  "event-2": {
    id: "event-2",
    title: "Cultural Arts Festival",
    summary:
      "A vibrant arts celebration with performances, exhibitions, and student creative showcases from across campus communities.",
    status: "upcoming",
    megaEvent: false,
    coverImageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop",
    dateDay: "02",
    dateMonth: "Nov",
    venueTitle: "Outdoor Plaza",
    venueSubtitle: "Main Campus",
    timeRange: "02:00 PM - 08:00 PM",
    startDateLabel: "Starts Sat, Nov 02, 2024",
    locationName: "Central Plaza Stage",
    locationWing: "Main Campus Open Area",
    aboutParagraphs: [
      "Cultural Arts Festival highlights music, dance, and visual arts presented by student organizations and invited guests.",
    ],
    attendance: {
      current: 214,
      capacity: 450,
      waitlist: 6,
      vips: 18,
    },
    organizingClub: {
      clubId: "club-2",
      name: "AASTU Arts Club",
      subtitle: "Since 2020 · 87 Members",
    },
    logistics: [
      { id: "venue", label: "Venue Name", value: "Outdoor Plaza" },
      { id: "coordinates", label: "Coordinates", value: "8.8891° N, 38.8004° E" },
      { id: "team", label: "Team Required", value: "10 Volunteers assigned" },
    ],
    mapImageUrl:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&auto=format&fit=crop",
  },
};

// ─── Venues ──────────────────────────────────────────────────────────────────
export const venueStats: VenueStat[] = [
  { id: "total-venues", title: "Total Venues", value: "42", icon: "Building2" },
  { id: "active-now", title: "Active Now", value: "38", icon: "CircleCheck" },
  { id: "maintenance", title: "Maintenance", value: "04", icon: "Wrench" },
  { id: "total-capacity", title: "Total Capacity", value: "12,500", icon: "Users" },
];

export const venueItems: VenueItem[] = [
  {
    id: "venue-1",
    name: "Main Auditorium",
    typeLabel: "Auditorium",
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop",
    location: "Admin Block, 2nd Floor",
    locationHint: "Campus East",
    capacityLabel: "1,200 Seats",
    status: "active",
  },
  {
    id: "venue-2",
    name: "Meeting Room B-12",
    typeLabel: "Meeting Room",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop",
    location: "Block B, Ground Floor",
    locationHint: "West Wing",
    capacityLabel: "25 Seats",
    status: "maintenance",
  },
  {
    id: "venue-3",
    name: "Amphitheater",
    typeLabel: "Outdoor Space",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&auto=format&fit=crop",
    location: "Central Plaza",
    locationHint: "Main Campus",
    capacityLabel: "2,500 Seats",
    status: "active",
  },
  {
    id: "venue-4",
    name: "Student Hub Lounge",
    typeLabel: "Indoor Space",
    imageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop",
    location: "Union Building, 1st Floor",
    locationHint: "Student Center",
    capacityLabel: "150 People",
    status: "inactive",
  },
  {
    id: "venue-5",
    name: "Innovation Lab",
    typeLabel: "Laboratory",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop",
    location: "Block C, 3rd Floor",
    locationHint: "Engineering Wing",
    capacityLabel: "80 Seats",
    status: "active",
  },
  {
    id: "venue-6",
    name: "Seminar Hall 3",
    typeLabel: "Seminar Hall",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&auto=format&fit=crop",
    location: "ICT Center, 2nd Floor",
    locationHint: "North Campus",
    capacityLabel: "220 Seats",
    status: "active",
  },
  {
    id: "venue-7",
    name: "Green Court",
    typeLabel: "Outdoor Space",
    imageUrl:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&auto=format&fit=crop",
    location: "Athletics Zone",
    locationHint: "South Campus",
    capacityLabel: "600 People",
    status: "maintenance",
  },
  {
    id: "venue-8",
    name: "Debate Chamber",
    typeLabel: "Debate Room",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop",
    location: "Block D, 1st Floor",
    locationHint: "Main Campus",
    capacityLabel: "90 Seats",
    status: "active",
  },
];

export const venueDetailItems: Record<string, VenueDetailItem> = {
  "venue-1": {
    id: "venue-1",
    name: "AASTU Grand Hall",
    subtitle:
      "The premier destination for academic excellence, major conferences, and cultural celebrations at the heart of Kilinto Campus.",
    status: "active",
    locationLabel: "Kilinto Campus, Block B",
    capacityLabel: "500 Seats",
    coverImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop",
    logoLabel: "GH",
    overview: [
      "The AASTU Grand Hall is the premier venue for large-scale events, conferences, and graduation ceremonies.",
      "Featuring state-of-the-art acoustic design and premium seating, it provides a professional environment for both academic and extracurricular activities.",
      "The hall is equipped with a raised stage, digital lighting controls, and dedicated media booths.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop",
    ],
    amenities: ["Audio System", "Wifi", "Projector"],
    upcomingSchedule: [
      {
        id: "s-1",
        day: "24",
        month: "Oct",
        title: "Annual Tech Symposium 2024",
        timeRange: "09:00 AM - 05:00 PM",
        organizer: "ICT Dept.",
        status: "confirmed",
      },
      {
        id: "s-2",
        day: "26",
        month: "Oct",
        title: "Student Union General Assembly",
        timeRange: "02:00 PM - 04:30 PM",
        organizer: "Student Council",
        status: "pending",
      },
      {
        id: "s-3",
        day: "28",
        month: "Oct",
        title: "Freshman Welcome Ceremony",
        timeRange: "08:30 AM - 12:00 PM",
        organizer: "Registrar Office",
        status: "confirmed",
      },
    ],
    mapImageUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop",
    gettingThere:
      "Located near the East Gate entrance, adjacent to the Library Complex, Kilinto Campus, Block B.",
    venueStatistics: {
      monthlyUtilization: "78%",
      eventsThisMonth: "14 Events",
      averageRating: "4.8 / 5.0",
    },
    contact: {
      name: "Abebe Kebede",
      role: "Hall Manager",
      phone: "+251 911 234 567",
      email: "hall.manager@aastu.edu.et",
    },
  },
};

// ─── Users Management ───────────────────────────────────────────────────────
export const userManagementStats: UserManagementStat[] = [
  { id: "admins", title: "Admins", value: "12", icon: "ShieldCheck", accent: "navy" },
  { id: "club-leaders", title: "Club Leaders", value: "48", icon: "Star", accent: "gold" },
  { id: "students", title: "Total Students", value: "1,240", icon: "Users", accent: "slate" },
];

export const userManagementItems: UserManagementItem[] = [
  {
    id: "user-1",
    name: "Abebe Molla",
    email: "abebe.molla@aastu.edu.et",
    initials: "AM",
    studentId: "ETS/0012/12",
    department: "Software Engineering",
    role: "su-admin",
  },
  {
    id: "user-2",
    name: "Bethlehem Kassaye",
    email: "bethlehem.k@aastu.edu.et",
    initials: "BK",
    studentId: "ETS/0458/13",
    department: "Architecture",
    role: "club-president",
  },
  {
    id: "user-3",
    name: "Dawit Mekonnen",
    email: "dawit.m@aastu.edu.et",
    initials: "DM",
    studentId: "ETS/1129/14",
    department: "Electrical Engineering",
    role: "general-student",
  },
  {
    id: "user-4",
    name: "Hanna Alemu",
    email: "hanna.a@aastu.edu.et",
    initials: "HA",
    studentId: "ETS/0882/13",
    department: "Civil Engineering",
    role: "club-president",
  },
  {
    id: "user-5",
    name: "Meron Belay",
    email: "meron.b@aastu.edu.et",
    initials: "MB",
    studentId: "ETS/0567/12",
    department: "Computer Science",
    role: "su-admin",
  },
  {
    id: "user-6",
    name: "Samuel Getachew",
    email: "samuel.g@aastu.edu.et",
    initials: "SG",
    studentId: "ETS/0941/14",
    department: "Mechanical Engineering",
    role: "general-student",
  },
  {
    id: "user-7",
    name: "Rahel Girma",
    email: "rahel.g@aastu.edu.et",
    initials: "RG",
    studentId: "ETS/0324/13",
    department: "Chemical Engineering",
    role: "club-president",
  },
  {
    id: "user-8",
    name: "Fitsum Teshome",
    email: "fitsum.t@aastu.edu.et",
    initials: "FT",
    studentId: "ETS/0109/12",
    department: "Software Engineering",
    role: "general-student",
  },
];

// ─── Bookings ───────────────────────────────────────────────────────────────
export const bookingTabs: BookingTab[] = [
  { id: "browse-venues", label: "Browse Venues" },
  { id: "my-bookings", label: "My Bookings" },
  { id: "approval-queue", label: "Approval Queue", showAdminBadge: true },
];

export const bookingStats: BookingStat[] = [
  { id: "total", title: "Total Bookings", value: "24", icon: "BookOpenCheck", accent: "navy" },
  { id: "pending", title: "Pending", value: "5", icon: "Clock3", accent: "gold" },
  { id: "approved", title: "Approved", value: "16", icon: "BadgeCheck", accent: "green" },
  { id: "cancelled", title: "Cancelled", value: "3", icon: "XCircle", accent: "red" },
];

export const bookingVenueFilters: BookingVenueFilter[] = [
  { id: "all", label: "All Venues" },
  { id: "auditorium", label: "Auditoriums" },
  { id: "meeting-room", label: "Meeting Rooms" },
  { id: "sports-facility", label: "Sports Facilities" },
  { id: "lab", label: "Labs" },
];

export const bookingVenueCards: BookingVenueCard[] = [
  {
    id: "booking-venue-1",
    name: "Red Hall Auditorium",
    description:
      "The premier venue for large-scale academic conferences and student showcases.",
    imageUrl:
      "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=900&auto=format&fit=crop",
    capacity: 500,
    category: "auditorium",
    status: "available",
  },
  {
    id: "booking-venue-2",
    name: "Senate Chamber",
    description:
      "Exclusive chamber for high-level administrative meetings and formal sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop",
    capacity: 50,
    category: "meeting-room",
    status: "blocked",
  },
  {
    id: "booking-venue-3",
    name: "ICT Seminar Room",
    description:
      "Tech-ready room ideal for workshops, software training, and hybrid presentations.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop",
    capacity: 100,
    category: "lab",
    status: "available",
  },
  {
    id: "booking-venue-4",
    name: "Student Lounge",
    description:
      "A relaxed open-concept space perfect for networking events and club socials.",
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop",
    capacity: 200,
    category: "meeting-room",
    status: "available",
  },
  {
    id: "booking-venue-5",
    name: "Multipurpose Court",
    description:
      "Vast indoor space suitable for sports tournaments, career fairs, and large exhibitions.",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&auto=format&fit=crop",
    capacity: 1500,
    category: "sports-facility",
    status: "available",
  },
  {
    id: "booking-venue-6",
    name: "Executive Boardroom",
    description:
      "Small, highly professional setting for sensitive committee meetings and strategic reviews.",
    imageUrl:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=900&auto=format&fit=crop",
    capacity: 15,
    category: "meeting-room",
    status: "blocked",
  },
];

export const myBookingItems: MyBookingItem[] = [
  {
    id: "my-booking-1",
    venueName: "Red Carpet Hall",
    eventTitle: "Freshman Welcome Ceremony",
    dateLabel: "Oct 25, 2024",
    timeLabel: "10:00 AM",
    status: "pending",
  },
  {
    id: "my-booking-2",
    venueName: "Block 54 Seminar Room",
    eventTitle: "Advanced Coding Workshop",
    dateLabel: "Oct 28, 2024",
    timeLabel: "02:00 PM",
    status: "approved",
  },
  {
    id: "my-booking-3",
    venueName: "Main Stadium",
    eventTitle: "Inter-College Sports Cup",
    dateLabel: "Nov 05, 2024",
    timeLabel: "08:30 AM",
    status: "approved",
  },
  {
    id: "my-booking-4",
    venueName: "Library Basement",
    eventTitle: "Study Group Marathon",
    dateLabel: "Oct 20, 2024",
    timeLabel: "09:00 AM",
    status: "cancelled",
  },
  {
    id: "my-booking-5",
    venueName: "Amphitheater",
    eventTitle: "Cultural Night Rehearsal",
    dateLabel: "Nov 12, 2024",
    timeLabel: "05:00 PM",
    status: "pending",
  },
  {
    id: "my-booking-6",
    venueName: "Innovation Hub",
    eventTitle: "Start-up Pitch Session",
    dateLabel: "Nov 18, 2024",
    timeLabel: "01:00 PM",
    status: "approved",
  },
  {
    id: "my-booking-7",
    venueName: "Main Plaza",
    eventTitle: "Community Art Showcase",
    dateLabel: "Nov 23, 2024",
    timeLabel: "03:30 PM",
    status: "cancelled",
  },
  {
    id: "my-booking-8",
    venueName: "ICT Seminar Room",
    eventTitle: "Cybersecurity Awareness Meetup",
    dateLabel: "Dec 01, 2024",
    timeLabel: "11:00 AM",
    status: "approved",
  },
];

export const bookingRequests: BookingRequestItem[] = [
  {
    id: "REQ-8829",
    requesterName: "Abebe Kebede",
    clubName: "Coding Club",
    venueName: "Block 52 - Hall A",
    capacityLabel: "Capacity: 120",
    dateLabel: "Oct 24, 2023",
    timeRange: "14:00 - 17:30",
    purpose: "Weekly programming seminar and coding challenge session.",
    venueType: "hall",
    requestedDateIso: "2023-10-24",
  },
  {
    id: "REQ-8830",
    requesterName: "Sara Tesfaye",
    clubName: "IEEE Student Branch",
    venueName: "Auditorium",
    capacityLabel: "Capacity: 500",
    dateLabel: "Oct 26, 2023",
    timeRange: "09:00 - 12:00",
    purpose: "Guest lecture series featuring local industry leaders.",
    venueType: "auditorium",
    requestedDateIso: "2023-10-26",
  },
  {
    id: "REQ-8831",
    requesterName: "Yonas Daniel",
    clubName: "Debate Club",
    venueName: "Library Basement B",
    capacityLabel: "Capacity: 40",
    dateLabel: "Oct 27, 2023",
    timeRange: "16:30 - 18:30",
    purpose: "Inter-college debate preparation and mock rounds.",
    venueType: "meeting-room",
    requestedDateIso: "2023-10-27",
  },
  {
    id: "REQ-8832",
    requesterName: "Hana Selassie",
    clubName: "Charity Group",
    venueName: "Main Plaza (Open)",
    capacityLabel: "Capacity: N/A",
    dateLabel: "Oct 30, 2023",
    timeRange: "08:00 - 18:00",
    purpose: "Awareness and donation campaign for local shelters.",
    venueType: "outdoor",
    requestedDateIso: "2023-10-30",
  },
];

export const bookingDetailItems: Record<string, BookingDetailItem> = {
  "my-booking-1": {
    id: "my-booking-1",
    venueSelectionId: "booking-venue-1",
    isBookable: true,
    venueIdLabel: "AUD-001",
    availabilityLabel: "Available Now",
    title: "Main Auditorium",
    subtitle:
      "The premier venue for large-scale academic, cultural, and corporate events at AASTU.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1464375117522-1311dd7d5b93?w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1464375117522-1311dd7d5b93?w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475727946784-2890b16be9e4?w=1400&auto=format&fit=crop",
    ],
    aboutParagraphs: [
      "The Main Auditorium at Addis Ababa Science & Technology University stands as a testament to architectural excellence and functional design. Spanning a vast area on the ground floor of Block B, this facility serves as the heart of campus life, hosting everything from prestigious international research symposiums to vibrant student cultural festivals.",
      "Equipped with state-of-the-art acoustic engineering, the hall ensures crystal-clear sound delivery to every one of its 1,200 seats. The recent renovation introduced a zero-emission climate control system and upgraded visual infrastructure to support 4K cinematic projection.",
    ],
    capacityLabel: "1,200 Seats",
    levelLabel: "Ground Floor",
    amenities: [
      "Full Audio Control Booth",
      "Integrated Climate Control",
      "Dedicated VIP Lounge",
      "High-Speed Campus WiFi",
      "Accessible Seating",
      "4K Laser Projection",
    ],
    locationTitle: "Central Campus, Block B",
    locationAddress:
      "Addis Ababa Science & Technology University, Akaki Kaliti, Addis Ababa.",
    locationMapImageUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&auto=format&fit=crop",
    availabilityMonthLabel: "Oct 2023",
    availabilityDays: [
      { dayLabel: "M", date: "1" },
      { dayLabel: "T", date: "2" },
      { dayLabel: "W", date: "3" },
      { dayLabel: "T", date: "4", active: true },
      { dayLabel: "F", date: "5" },
      { dayLabel: "S", date: "6" },
      { dayLabel: "S", date: "7" },
      { dayLabel: "M", date: "8" },
      { dayLabel: "T", date: "9", busy: true },
      { dayLabel: "W", date: "10" },
      { dayLabel: "T", date: "11" },
      { dayLabel: "F", date: "12" },
      { dayLabel: "S", date: "13" },
      { dayLabel: "S", date: "14" },
    ],
    upcomingEvents: [
      {
        id: "u-1",
        dateLabel: "Oct 4",
        timeLabel: "10:00 AM",
        title: "Annual Research Expo",
      },
      {
        id: "u-2",
        dateLabel: "Oct 9",
        timeLabel: "02:00 PM",
        title: "Private University Gala",
      },
    ],
    similarVenues: [
      {
        id: "booking-venue-2",
        tag: "Conference",
        name: "Digital Innovation Hub",
        capacity: 250,
        location: "Block D",
        imageUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop",
      },
      {
        id: "booking-venue-6",
        tag: "Boardroom",
        name: "Executive Council Hall",
        capacity: 50,
        location: "Admin Wing",
        imageUrl:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop",
      },
      {
        id: "booking-venue-5",
        tag: "Outdoor",
        name: "The Grand Amphitheater",
        capacity: 3000,
        location: "East Plaza",
        imageUrl:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop",
      },
    ],
  },
};
