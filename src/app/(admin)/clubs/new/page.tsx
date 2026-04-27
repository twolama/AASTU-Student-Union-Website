import type { Metadata } from "next";
import { ClubEditor } from "@/components/dashboard/clubs/ClubEditor";

export const metadata: Metadata = {
  title: "Add New Club",
};

export default function CreateClubPage() {
  return (
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
  );
}
