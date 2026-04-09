import type { Metadata } from "next";
import { ClubEditor } from "@/components/dashboard/clubs/ClubEditor";
import { clubItems } from "@/data/dummy";

interface EditClubPageProps {
  params: Promise<{ clubId: string }>;
}

function categoryToValue(categoryLabel: string) {
  return categoryLabel.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");
}

export async function generateMetadata({ params }: EditClubPageProps): Promise<Metadata> {
  const { clubId } = await params;
  const club = clubItems.find((item) => item.id === clubId);

  return {
    title: club ? `Edit ${club.name}` : "Edit Club",
  };
}

export default async function EditClubPage({ params }: EditClubPageProps) {
  const { clubId } = await params;
  const club = clubItems.find((item) => item.id === clubId);

  return (
    <ClubEditor
      mode="edit"
      clubId={clubId}
      initialValues={{
        clubName: club?.name ?? "",
        description:
          "This club profile is being updated by the Student Union office. Review leadership, digital presence, and operational status details.",
        category: club ? categoryToValue(club.categoryLabel) : "",
        bannerUrl: "",
        bannerFileName: undefined,
        logoUrl: "",
        logoFileName: undefined,
        presidentFullName: club?.presidentName ?? "",
        presidentDepartment: "Software Engineering",
        presidentId: "",
        presidentEmail: "",
        presidentPhone: "",
        presidentDormBlock: "",
        presidentDormRoom: "",
        advisorName: club?.advisorName ?? "",
        advisorDepartment: "Software Engineering",
        advisorPhone: "",
        advisorEmail: "",
        telegramUrl: "",
        linkedinUrl: "",
        githubUrl: "",
        youtubeUrl: "",
        websiteUrl: "",
        externalMembershipUrl: "",
        status: club?.status ?? "pending",
      }}
    />
  );
}
