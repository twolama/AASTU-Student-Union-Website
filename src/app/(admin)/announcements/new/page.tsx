import type { Metadata } from "next";
import { AnnouncementEditor } from "@/components/dashboard/announcements/AnnouncementEditor";

export const metadata: Metadata = {
  title: "Create Announcement",
};

export default function CreateAnnouncementPage() {
  return (
    <AnnouncementEditor
      mode="create"
      initialValues={{
        title: "",
        summary: "",
        body: "",
        category: "",
        originatingBody: "Office of the Registrar",
        pinned: false,
        coverImageUrl: "",
        coverImageName: undefined,
        tags: ["Announcement", "AASTU"],
        procedureSteps: [],
      }}
    />
  );
}