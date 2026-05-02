"use client";

import { PublicClubsContent } from "@/components/public/clubs/PublicClubsContent";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { useClubs } from "@/hooks/useClubs";
import { Loader2 } from "lucide-react";
import type { ClubItem } from "@/types/dashboard";

export function PublicClubsPage() {
  const { data: clubsData, isLoading, isError } = useClubs(1, 100, undefined, "active");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3f3f3]">
        <Loader2 className="h-10 w-10 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  // Map API data to ClubItem format
  const activeClubs: ClubItem[] = (clubsData?.data ?? []).map((club) => ({
    id: club.id,
    name: club.name,
    categoryLabel: club.categoryName || "General",
    status: club.status as any,
    logo: club.logo,
    logoLabel: club.logoLabel || club.name.charAt(0),
    coverImage: club.coverImage,
    description: club.description || "",
    memberCount: (club as any).member_count || 0,
    presidentName: club.presidentName || "Unknown",
    advisorName: club.advisorName || "Unknown",
    headerGradient: "bg-linear-to-r from-[#1f2a44] to-[#2d3b5a]",
  }));

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <PublicClubsContent clubs={activeClubs} />
      </section>

      <PublicFooter />
    </main>
  );
}

