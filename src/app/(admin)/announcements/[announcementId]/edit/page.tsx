"use client";

import { use } from "react";
import { AnnouncementEditor } from "@/components/dashboard/announcements/AnnouncementEditor";
import { useAnnouncement } from "@/hooks/useAnnouncements";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

const originatingBodies = [
  "Office of the Registrar",
  "Student Affairs Office",
  "AASTU Student Union",
  "Academic Affairs Office",
];

function resolveOriginatingBody(value?: string | null) {
  if (!value) {
    return "";
  }

  const normalized = value.trim().toLowerCase();
  return originatingBodies.find((body) => body.toLowerCase() === normalized) ?? "";
}

interface EditAnnouncementPageProps {
  params: Promise<{ announcementId: string }>;
}

export default function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
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

  // Map API response to Editor values
  const initialValues = {
    title: announcement.title,
    summary: announcement.bodyExcerpt,
    body: announcement.body || announcement.bodyExcerpt,
    category: announcement.category || "",
    originatingBody: resolveOriginatingBody(announcement.authorName || announcement.authorRoleName),
    pinned: announcement.isPinned,
    isPublished: announcement.isPublished ?? false,
    coverImageUrl: announcement.image || "",
    coverImageName: undefined,
    tags: announcement.tags || [],
    procedureSteps: announcement.procedureSteps || [],
  };

  return (
    <AnnouncementEditor
      mode="edit"
      announcementId={announcementId}
      initialValues={initialValues}
    />
  );
}