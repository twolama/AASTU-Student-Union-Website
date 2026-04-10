export interface PublicEventHero {
  tag: string;
  dateTime: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
}

export interface PublicEventItem {
  id: string;
  title: string;
  filterCategory: string;
  category: string;
  venue: string;
  timeRange: string;
  dateDay: string;
  dateMonth: string;
  imageUrl: string;
}

export interface PublicEventAgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface PublicEventDetail {
  id: string;
  heroPrimaryTag: string;
  heroSecondaryTag: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  venueLabel: string;
  heroImageUrl: string;
  aboutParagraphs: string[];
  quote: string;
  details: {
    organization: string;
    capacity: string;
    coordinator: string;
  };
  venueCard: {
    title: string;
    subtitle: string;
    mapImageUrl: string;
  };
  agenda: PublicEventAgendaItem[];
}

export const publicEventsHero: PublicEventHero = {
  tag: "Mega Event",
  dateTime: "May 24, 2024 | 09:00 AM",
  title: "International STEM Innovation Summit",
  description:
    "Join global thought leaders and local innovators for a 48-hour deep dive into the future of Ethiopian technology and engineering.",
  imageUrl:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&auto=format&fit=crop",
  ctaLabel: "Register Now",
};

export const publicEventCategories = [
  "All Events",
  "Academic",
  "Cultural",
  "Sports",
  "Workshops",
] as const;

export const publicEventItems: PublicEventItem[] = [
  {
    id: "robotics-workshop",
    title: "Advanced Robotics & AI Workshop",
    filterCategory: "Workshops",
    category: "Engineering",
    venue: "Main Auditorium",
    timeRange: "02:00 PM - 05:00 PM",
    dateDay: "12",
    dateMonth: "Jun",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1100&auto=format&fit=crop",
  },
  {
    id: "heritage-festival",
    title: "Unity Arts & Heritage Festival",
    filterCategory: "Cultural",
    category: "Cultural",
    venue: "Campus Green Plaza",
    timeRange: "10:00 AM - 08:00 PM",
    dateDay: "15",
    dateMonth: "Jun",
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1100&auto=format&fit=crop",
  },
  {
    id: "basketball-finals",
    title: "Inter-Departmental Basketball Finals",
    filterCategory: "Sports",
    category: "Sports",
    venue: "Sport Complex Center",
    timeRange: "04:30 PM - 07:00 PM",
    dateDay: "18",
    dateMonth: "Jun",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1100&auto=format&fit=crop",
  },
  {
    id: "career-night",
    title: "Tech-Career Networking Night",
    filterCategory: "Academic",
    category: "Career",
    venue: "Innovation Hub L3",
    timeRange: "06:00 PM - 09:00 PM",
    dateDay: "22",
    dateMonth: "Jun",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1100&auto=format&fit=crop",
  },
  {
    id: "science-expo",
    title: "Annual Science Expo: Green Future",
    filterCategory: "Academic",
    category: "Research",
    venue: "Central Exhibition Hall",
    timeRange: "09:00 AM - 04:00 PM",
    dateDay: "25",
    dateMonth: "Jun",
    imageUrl:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1100&auto=format&fit=crop",
  },
  {
    id: "leadership-forum",
    title: "Student Leadership Forum 2024",
    filterCategory: "Academic",
    category: "Academic",
    venue: "Senate Hall",
    timeRange: "01:00 PM - 04:30 PM",
    dateDay: "29",
    dateMonth: "Jun",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1100&auto=format&fit=crop",
  },
  {
    id: "community-hackathon",
    title: "Community Impact Hackathon",
    filterCategory: "Workshops",
    category: "Workshops",
    venue: "ICT Lab Complex",
    timeRange: "08:30 AM - 06:00 PM",
    dateDay: "02",
    dateMonth: "Jul",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1100&auto=format&fit=crop",
  },
  {
    id: "debate-championship",
    title: "National Campus Debate Championship",
    filterCategory: "Cultural",
    category: "Cultural",
    venue: "Main Hall",
    timeRange: "11:00 AM - 03:30 PM",
    dateDay: "06",
    dateMonth: "Jul",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1100&auto=format&fit=crop",
  },
];

const coordinatorNames = [
  "Dr. Elias Tadesse",
  "Mekdes Alemu",
  "Yonas Tesfaye",
  "Selamawit Bekele",
] as const;

const monthMap: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

function toDateLabel(day: string, month: string) {
  return `${monthMap[month] ?? month} ${day}, 2024`;
}

function makeAgenda(category: string): PublicEventAgendaItem[] {
  return [
    {
      id: `${category}-agenda-1`,
      time: "09:00 AM",
      title: "Opening Keynote",
      description: `Future outlook for ${category.toLowerCase()} programs at AASTU.`,
    },
    {
      id: `${category}-agenda-2`,
      time: "11:30 AM",
      title: "Interactive Workshop",
      description: "Hands-on sessions led by faculty and student club representatives.",
    },
    {
      id: `${category}-agenda-3`,
      time: "02:00 PM",
      title: "Panel Discussion",
      description: "Cross-disciplinary discussion on impact, innovation, and collaboration.",
    },
  ];
}

export const publicEventDetails: Record<string, PublicEventDetail> = Object.fromEntries(
  publicEventItems.map((item, index) => {
    const organization = `${item.category} Student Club`;
    const capacity = `${260 + index * 40} Attendees`;
    const coordinator = coordinatorNames[index % coordinatorNames.length];

    const detail: PublicEventDetail = {
      id: item.id,
      heroPrimaryTag: item.filterCategory === "Academic" ? "Mega Event" : item.filterCategory,
      heroSecondaryTag: item.category,
      title: item.title,
      dateLabel: toDateLabel(item.dateDay, item.dateMonth),
      timeLabel: item.timeRange,
      venueLabel: item.venue,
      heroImageUrl: item.imageUrl,
      aboutParagraphs: [
        `${item.title} is one of the signature student experiences on campus, bringing together learners, mentors, and professionals around ${item.category.toLowerCase()} excellence.`,
        "Participants will engage in practical sessions, collaborative discussions, and showcases designed to turn ideas into concrete outcomes for the university community.",
        "Whether you are attending to learn, network, or present your work, this event is structured to deliver both inspiration and actionable next steps.",
      ],
      quote:
        "The summit represents the spirit of AASTU: where curiosity meets practical engineering and students lead meaningful change.",
      details: {
        organization,
        capacity,
        coordinator,
      },
      venueCard: {
        title: `${item.venue}, Block ${20 + (index % 5)}`,
        subtitle: "Kilinto, Akaki-Kality Sub-city, Addis Ababa",
        mapImageUrl:
          "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop",
      },
      agenda: makeAgenda(item.category),
    };

    return [item.id, detail];
  })
);

export function getPublicEvents() {
  return publicEventItems;
}

export function getPublicEventDetail(eventId: string) {
  return publicEventDetails[eventId] ?? null;
}
