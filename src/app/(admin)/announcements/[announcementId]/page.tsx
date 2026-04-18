"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useAnnouncement } from "@/hooks/useAnnouncements";
import { AnnouncementPreviewContent } from "@/components/dashboard/announcements/AnnouncementPreviewContent";
import { Loader2 } from "lucide-react";

interface AnnouncementPreviewPageProps {
  params: Promise<{ announcementId: string }>;
}

export default function AnnouncementPreviewPage({ params }: AnnouncementPreviewPageProps) {
  const { announcementId } = use(params);
  const { data: announcement, isLoading, isError } = useAnnouncement(announcementId);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  if (isError || !announcement) {
    notFound();
  }

  return <AnnouncementPreviewContent item={announcement} />;
}