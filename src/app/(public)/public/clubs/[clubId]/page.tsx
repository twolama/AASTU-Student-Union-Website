import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicClubDetailPage } from "@/components/public/clubs/PublicClubDetailPage";
import { getPublicActiveClubDetail, getPublicActiveClubs } from "@/lib/public/clubs";

interface ClubDetailRouteProps {
  params: Promise<{
    clubId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ClubDetailRouteProps): Promise<Metadata> {
  const { clubId } = await params;
  const club = getPublicActiveClubDetail(clubId);

  if (!club) {
    return {
      title: "Club Not Found",
    };
  }

  return {
    title: club.name,
    description: `Public profile for ${club.name}.`,
  };
}

export function generateStaticParams() {
  return getPublicActiveClubs().map((club) => ({ clubId: club.id }));
}

export default async function ClubDetailPage({ params }: ClubDetailRouteProps) {
  const { clubId } = await params;
  const club = getPublicActiveClubDetail(clubId);

  if (!club) {
    notFound();
  }

  return <PublicClubDetailPage club={club} />;
}
