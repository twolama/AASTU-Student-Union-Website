import type { Metadata } from "next";
import { AnnouncementEditor } from "@/components/dashboard/announcements/AnnouncementEditor";
import { announcementItems } from "@/data/dummy";

interface EditAnnouncementPageProps {
  params: Promise<{ announcementId: string }>;
}

export async function generateMetadata({ params }: EditAnnouncementPageProps): Promise<Metadata> {
  const { announcementId } = await params;
  const announcement = announcementItems.find((item) => item.id === announcementId);

  return {
    title: announcement ? `Edit ${announcement.title}` : "Edit Announcement",
  };
}

export default async function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
  const { announcementId } = await params;
  const announcement = announcementItems.find((item) => item.id === announcementId);

  return (
    <AnnouncementEditor
      mode="edit"
      announcementId={announcementId}
      initialValues={{
        title: announcement?.title ?? "",
        summary: announcement?.summary ?? "",
        body: announcement?.summary ?? "",
        category: announcement?.category ?? "academic",
        originatingBody: announcement?.authorName ?? "Office of the Registrar",
        pinned: false,
        coverImageUrl: announcement?.imageUrl ?? "",
        coverImageName: undefined,
      }}
    />
  );
}