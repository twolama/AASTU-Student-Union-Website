import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicAnnouncementDetailPage } from "@/components/public/announcements/PublicAnnouncementDetailPage";
import { getPublicAnnouncementDetail, getPublicAnnouncements } from "@/lib/public/announcements";

interface AnnouncementDetailRouteProps {
  params: Promise<{
    announcementId: string;
  }>;
}

export async function generateMetadata({ params }: AnnouncementDetailRouteProps): Promise<Metadata> {
  const { announcementId } = await params;
  const announcement = getPublicAnnouncementDetail(announcementId);

  if (!announcement) {
    return {
      title: "Announcement Not Found",
    };
  }

  return {
    title: announcement.title,
    description: `Details for ${announcement.title}.`,
  };
}

export function generateStaticParams() {
  return getPublicAnnouncements().map((announcement) => ({ announcementId: announcement.id }));
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailRouteProps) {
  const { announcementId } = await params;
  const announcement = getPublicAnnouncementDetail(announcementId);
  const item = getPublicAnnouncements().find((entry) => entry.id === announcementId);

  if (!announcement || !item) {
    notFound();
  }

  return <PublicAnnouncementDetailPage announcement={announcement} item={item} />;
}
