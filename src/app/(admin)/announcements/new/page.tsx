import type { Metadata } from "next";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AnnouncementEditor } from "@/components/dashboard/announcements/AnnouncementEditor";

export const metadata: Metadata = {
  title: "Create Announcement",
};

export default function CreateAnnouncementPage() {
  return (
    <PermissionGate
      anyOf={["announcements.create"]}
      fallback={
        <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          You do not have permission to create announcements.
        </div>
      }
    >
      <AnnouncementEditor
        mode="create"
        initialValues={{
          title: "",
          summary: "",
          body: "",
          category: "",
          originatingBody: "",
          pinned: false,
          isPublished: false,
          coverImageUrl: "",
          coverImageName: undefined,
          tags: ["Announcement", "AASTU"],
          procedureSteps: [],
        }}
      />
    </PermissionGate>
  );
}