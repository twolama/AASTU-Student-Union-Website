"use client";

import { use } from "react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ClubEditor } from "@/components/dashboard/clubs/ClubEditor";
import { useClub } from "@/hooks/useClubs";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

interface EditClubPageProps {
  params: Promise<{ clubId: string }>;
}

export default function EditClubPage({ params }: EditClubPageProps) {
  const { clubId } = use(params);
  const { data: club, isLoading, isError } = useClub(clubId);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  if (isError || !club) {
    notFound();
  }

  const links = club.links as any || {};

  return (
    <PermissionGate
      anyOf={["clubs.edit"]}
      fallback={
        <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          You do not have permission to edit clubs.
        </div>
      }
    >
      <ClubEditor
        mode="edit"
        clubId={clubId}
        initialValues={{
          clubName: club.name,
          description: club.description || "",
          category: club.category || "",
          locationLabel: club.locationLabel || "",
          logoLabel: club.logoLabel || "",
          bannerUrl: club.coverImage || "",
          logoUrl: club.logo || "",
          presidentFullName: (club.presidentDetails as any)?.name || "",
          presidentDepartment: (club.presidentDetails as any)?.departmentName || (club.presidentDetails as any)?.department || "",
          presidentId: (club.presidentDetails as any)?.studentId || "",
          presidentEmail: (club.presidentDetails as any)?.email || "",
          presidentPhone: (club.presidentDetails as any)?.phoneNumber || "",
          presidentDormBlock: (club.presidentDetails as any)?.dormBlock || "",
          presidentDormRoom: (club.presidentDetails as any)?.dormRoom || "",
          advisorName: (club.advisorDetails as any)?.name || "",
          advisorDepartment: (club.advisorDetails as any)?.departmentName || (club.advisorDetails as any)?.department || "",
          advisorPhone: (club.advisorDetails as any)?.phoneNumber || "",
          advisorEmail: (club.advisorDetails as any)?.email || "",
          advisorStudentId: (club.advisorDetails as any)?.studentId || "",
          advisorDormBlock: (club.advisorDetails as any)?.dormBlock || "",
          advisorDormRoom: (club.advisorDetails as any)?.dormRoom || "",
          telegramUrl: links.telegram || "",
          linkedinUrl: links.linkedin || "",
          githubUrl: links.github || "",
          youtubeUrl: links.youtube || "",
          websiteUrl: links.website || "",
          externalMembershipUrl: links.membership || "",
          status: (club.status as any) || "pending",
          president: club.president || "",
          advisor: club.advisor || "",
          department: club.department || "",
          proposalFileUrl: club.proposalFile || "",
          proposalFileName: club.proposalFile ? club.proposalFile.split("/").pop() : undefined,
          showProposal: club.showProposal || false,
        }}
      />
    </PermissionGate>
  );
}
