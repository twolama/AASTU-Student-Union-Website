import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { announcementItems, announcementPreviewData } from "@/data/dummy";
import { AnnouncementPreviewContent } from "@/components/dashboard/announcements/AnnouncementPreviewContent";

interface AnnouncementPreviewPageProps {
  params: Promise<{ announcementId: string }>;
}

export async function generateMetadata({ params }: AnnouncementPreviewPageProps): Promise<Metadata> {
  const { announcementId } = await params;
  const detail = announcementPreviewData[announcementId];
  const basic = announcementItems.find((item) => item.id === announcementId);

  return {
    title: detail?.title ?? basic?.title ?? "Announcement Preview",
  };
}

export default async function AnnouncementPreviewPage({ params }: AnnouncementPreviewPageProps) {
  const { announcementId } = await params;
  const detail = announcementPreviewData[announcementId];

  if (!detail) {
    notFound();
  }

  return <AnnouncementPreviewContent item={detail} />;
}