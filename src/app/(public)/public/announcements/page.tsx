import type { Metadata } from "next";
import { PublicAnnouncementsPage } from "@/components/public/announcements/PublicAnnouncementsPage";

export const metadata: Metadata = {
  title: "Announcements",
  description: "Browse campus announcements and student union notices.",
};

export default function AnnouncementsPage() {
  return <PublicAnnouncementsPage />;
}
