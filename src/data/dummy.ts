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
};
