import {
  announcementItems as baseAnnouncementItems,
  announcementPreviewData as baseAnnouncementPreviewData,
} from "@/data/dummy";
import type { AnnouncementCategory, AnnouncementItem, AnnouncementPreviewData, AnnouncementTab } from "@/types/dashboard";

export const publicAnnouncementTabs: AnnouncementTab[] = [
  { id: "all", label: "All News" },
  { id: "academic", label: "Academic Affairs" },
  { id: "social", label: "Student Life" },
  { id: "union", label: "Council Notices" },
];

const extraAnnouncementItems: AnnouncementItem[] = [
  {
    id: "ann-4",
    title: "Library Access Hours Extended for Midterms",
    summary:
      "The central library will remain open later through the midterm exam period to support student study sessions and group work.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&auto=format&fit=crop",
    category: "academic",
    publishedAgo: "Published 4 hours ago",
    authorName: "Library Office",
  },
  {
    id: "ann-5",
    title: "Scholarship Applications Open for Spring Cycle",
    summary:
      "Eligible students can now submit scholarship applications for the spring award cycle through the student portal.",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&auto=format&fit=crop",
    category: "academic",
    publishedAgo: "Published yesterday",
    authorName: "Financial Aid Office",
  },
  {
    id: "ann-6",
    title: "Campus Cafeteria Menu and Meal Plan Update",
    summary:
      "The cafeteria team has published an updated menu and revised meal plan pricing for the remainder of the semester.",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop",
    category: "social",
    publishedAgo: "Published yesterday",
    authorName: "Campus Services",
  },
  {
    id: "ann-7",
    title: "Freshers Welcome Week Schedule Now Available",
    summary:
      "Orientation activities, campus tours, and welcome sessions are now scheduled for the new student intake week.",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop",
    category: "social",
    publishedAgo: "2 days ago",
    authorName: "Student Affairs",
  },
  {
    id: "ann-8",
    title: "Student Council Budget Review Session Announced",
    summary:
      "Department delegates will review the semester budget allocations and upcoming student project requests this Friday.",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&auto=format&fit=crop",
    category: "union",
    publishedAgo: "2 days ago",
    authorName: "Student Council",
  },
  {
    id: "ann-9",
    title: "Election Nomination Window Opens Tomorrow",
    summary:
      "Students interested in running for the coming council election can submit nomination forms from tomorrow morning.",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&auto=format&fit=crop",
    category: "union",
    publishedAgo: "3 days ago",
    authorName: "Election Board",
  },
  {
    id: "ann-10",
    title: "Lab Safety Refresher Required for All Science Students",
    summary:
      "A mandatory refresher will be held for students scheduled to use chemistry and engineering laboratories this month.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900&auto=format&fit=crop",
    category: "academic",
    publishedAgo: "4 days ago",
    authorName: "Lab Coordinator",
  },
  {
    id: "ann-11",
    title: "Volunteer Drive for Campus Clean-up Day",
    summary:
      "Student volunteers are invited to support the upcoming campus clean-up campaign and community outreach activity.",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop",
    category: "social",
    publishedAgo: "5 days ago",
    authorName: "Community Service Desk",
  },
  {
    id: "ann-12",
    title: "Campus Wi-Fi Maintenance Window This Weekend",
    summary:
      "Temporary network maintenance will take place on Saturday night to improve speed and coverage in key buildings.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop",
    category: "academic",
    publishedAgo: "1 week ago",
    authorName: "ICT Department",
  },
];

const categoryProfiles: Record<AnnouncementCategory, Omit<AnnouncementPreviewData, "id" | "title" | "imageUrl" | "authorName" | "publishedDate" | "readTime" | "introText" | "tags">> = {
  academic: {
    subtitleBadge: "Academic Affairs",
    authorRole: "Registrar Office",
    timelineHeading: "Academic Schedule",
    timelineText:
      "Academic updates are coordinated with the registrar and department offices to keep students aligned with deadlines and campus policy.",
    keyRequirements: [
      "Bring your valid student ID to any in-person desk.",
      "Review the official portal for the latest schedule updates.",
      "Submit requests before the published deadline.",
    ],
    procedureSteps: [
      "Review the announcement carefully and confirm the affected dates.",
      "Complete any required form or portal action before the deadline.",
      "Contact your department office if you need clarification.",
    ],
    supportNote:
      "If you need help with academic notices, visit the Registrar help desk during working hours.",
  },
  social: {
    subtitleBadge: "Student Life",
    authorRole: "Student Affairs",
    timelineHeading: "Community Program",
    timelineText:
      "Student life notices highlight activities, events, and services that support a healthy campus experience beyond the classroom.",
    keyRequirements: [
      "Check whether attendance or registration is required.",
      "Respect venue rules and event safety instructions.",
      "Arrive early for popular student life activities.",
    ],
    procedureSteps: [
      "Read the announcement summary and note the venue details.",
      "Register or reserve your place if the activity has limited capacity.",
      "Follow the event staff guidance when you arrive.",
    ],
    supportNote:
      "For student life questions, contact the Student Affairs desk near the main hall.",
  },
  union: {
    subtitleBadge: "Council Notices",
    authorRole: "Student Council",
    timelineHeading: "Council Timeline",
    timelineText:
      "Council notices cover meetings, elections, and governance updates that shape student representation and policy decisions.",
    keyRequirements: [
      "Council updates may require department delegate attendance.",
      "Bring agenda notes or prior meeting materials when relevant.",
      "Submit questions or nominations before the stated deadline.",
    ],
    procedureSteps: [
      "Review the notice and confirm the meeting or election timeline.",
      "Prepare any required forms, feedback, or nomination documents.",
      "Attend the scheduled session or submit materials on time.",
    ],
    supportNote:
      "For council notices, contact the Student Union secretariat during office hours.",
  },
};

const publicAnnouncementItems = [...baseAnnouncementItems, ...extraAnnouncementItems];

const readTimes = ["3 min read", "4 min read", "5 min read", "2 min read"];
const publishedDates = [
  "Mar 14, 2024",
  "Mar 18, 2024",
  "Mar 22, 2024",
  "Mar 25, 2024",
  "Mar 28, 2024",
  "Apr 02, 2024",
  "Apr 07, 2024",
  "Apr 11, 2024",
  "Apr 15, 2024",
  "Apr 18, 2024",
  "Apr 21, 2024",
  "Apr 25, 2024",
];

function getCategoryLabel(category: AnnouncementCategory) {
  return categoryProfiles[category].subtitleBadge;
}

function buildDetail(item: AnnouncementItem, index: number): AnnouncementPreviewData {
  const profile = categoryProfiles[item.category];

  return {
    id: item.id,
    title: item.title,
    subtitleBadge: profile.subtitleBadge,
    imageUrl: item.imageUrl,
    authorName: item.authorName,
    authorRole: profile.authorRole,
    publishedDate: publishedDates[index % publishedDates.length],
    readTime: readTimes[index % readTimes.length],
    introText: item.summary,
    timelineHeading: profile.timelineHeading,
    timelineText: profile.timelineText,
    keyRequirements: profile.keyRequirements,
    procedureSteps: profile.procedureSteps,
    supportNote: profile.supportNote,
    tags: [
      `#${item.category === "academic" ? "AcademicUpdate" : item.category === "social" ? "StudentLife" : "Council"}`,
      `#${item.authorName.replace(/\s+/g, "")}`,
      "#AASTU",
    ],
  };
}

export const publicAnnouncementDetails: Record<string, AnnouncementPreviewData> = Object.fromEntries(
  publicAnnouncementItems.map((item, index) => [item.id, buildDetail(item, index)])
);

export function getPublicAnnouncements() {
  return publicAnnouncementItems;
}

export function getPublicAnnouncementDetail(announcementId: string) {
  return publicAnnouncementDetails[announcementId] ?? null;
}

export function getPublicAnnouncementCategoryLabel(category: AnnouncementCategory) {
  return getCategoryLabel(category);
}

export { publicAnnouncementItems };
