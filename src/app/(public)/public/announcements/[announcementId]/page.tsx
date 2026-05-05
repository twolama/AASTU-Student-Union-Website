import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicAnnouncementDetailPage } from "@/components/public/announcements/PublicAnnouncementDetailPage";

interface AnnouncementDetailRouteProps {
  params: Promise<{
    announcementId: string;
  }>;
}

async function getAnnouncement(id: string) {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${baseUrl}/api/v1/announcements/${id}/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return null;
  }
}

async function getRelatedAnnouncements(currentId: string) {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${baseUrl}/api/v1/announcements/?limit=4`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).filter((a: any) => a.id !== currentId).slice(0, 3);
  } catch (error) {
    console.error("Error fetching related announcements:", error);
    return [];
  }
}

export async function generateMetadata({ params }: AnnouncementDetailRouteProps): Promise<Metadata> {
  const { announcementId } = await params;
  const announcement = await getAnnouncement(announcementId);

  if (!announcement) {
    return {
      title: "Announcement Not Found",
    };
  }

  return {
    title: announcement.title,
    description: announcement.bodyExcerpt || `Details for ${announcement.title}.`,
  };
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailRouteProps) {
  const { announcementId } = await params;
  
  const [announcement, relatedAnnouncements] = await Promise.all([
    getAnnouncement(announcementId),
    getRelatedAnnouncements(announcementId),
  ]);

  if (!announcement) {
    notFound();
  }

  return (
    <PublicAnnouncementDetailPage 
      announcement={announcement} 
      relatedAnnouncements={relatedAnnouncements} 
    />
  );
}
