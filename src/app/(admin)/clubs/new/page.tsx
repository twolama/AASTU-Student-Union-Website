import type { Metadata } from "next";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ClubEditor } from "@/components/dashboard/clubs/ClubEditor";

export const metadata: Metadata = {
  title: "Add New Club",
};

export default function CreateClubPage() {
  return (
    <PermissionGate
      anyOf={["clubs.create"]}
      fallback={
        <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          You do not have permission to create clubs.
        </div>
      }
    >
      <ClubEditor
        mode="create"
        initialValues={{
          clubName: "",
          description: "",
          category: "",
          locationLabel: "",
          logoLabel: "",
          bannerUrl: "",
          bannerFileName: undefined,
          logoUrl: "",
          logoFileName: undefined,
          presidentFullName: "",
          presidentDepartment: "",
          presidentId: "",
          presidentEmail: "",
          presidentPhone: "",
          presidentDormBlock: "",
          presidentDormRoom: "",
          advisorName: "",
          advisorDepartment: "",
          advisorPhone: "",
          advisorEmail: "",
          advisorStudentId: "",
          advisorDormBlock: "",
          advisorDormRoom: "",
          telegramUrl: "",
          linkedinUrl: "",
          githubUrl: "",
          youtubeUrl: "",
          websiteUrl: "",
          externalMembershipUrl: "",
          status: "pending",
          president: "",
          advisor: "",
          department: "",
        }}
      />
    </PermissionGate>
  );
}
