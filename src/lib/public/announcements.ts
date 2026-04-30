import type { AnnouncementCategory, AnnouncementTab } from "@/types/dashboard";

export const publicAnnouncementTabs: AnnouncementTab[] = [
  { id: "all", label: "All News" },
  { id: "academic", label: "Academic Affairs" },
  { id: "social", label: "Student Life" },
  { id: "union", label: "Council Notices" },
];

const announcementCategoryLabels: Record<string, string> = {
  all: "All News",
  academic: "Academic Affairs",
  social: "Student Life",
  union: "Council Notices",
};

export function getPublicAnnouncementCategoryLabel(category: AnnouncementCategory) {
  return announcementCategoryLabels[category] ?? category.replace(/^[a-z]/, (char) => char.toUpperCase());
}
