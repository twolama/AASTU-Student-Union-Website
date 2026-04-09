import type { Metadata } from "next";
import { ClubDetailView } from "@/components/dashboard/clubs/ClubDetailView";
import { clubDetailItems, clubItems } from "@/data/dummy";

interface ClubDetailPageProps {
  params: Promise<{ clubId: string }>;
}

function getFallbackClubDetail(clubId: string) {
  const fallbackItem = clubItems.find((item) => item.id === clubId);

  if (!fallbackItem) {
    return null;
  }

  return {
    id: fallbackItem.id,
    name: fallbackItem.name,
    status: fallbackItem.status,
    categoryLabel: fallbackItem.categoryLabel,
    locationLabel: "AASTU Main Campus",
    logoLabel: fallbackItem.logoLabel,
    coverImageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop",
    about: [
      `${fallbackItem.name} is part of the AASTU Student Union club ecosystem. This profile can be expanded with full background information, achievements, and strategic goals.`,
    ],
    stats: [
      { id: "members", label: "Total Members", value: "--" },
      { id: "events", label: "Events Hosted", value: "--" },
      { id: "rank", label: "Campus Ranking", value: "--" },
    ],
    links: {
      website: "https://aastu.edu.et",
      externalMembership: "https://aastu.edu.et",
    },
    contacts: [
      {
        id: "president",
        roleLabel: "Club President",
        name: fallbackItem.presidentName,
        subtitle: "Student Leader",
        email: "not-provided@aastu.edu.et",
        phone: "Not provided",
        location: "AASTU Campus",
        initials: fallbackItem.logoLabel,
      },
      {
        id: "advisor",
        roleLabel: "Club Advisor",
        name: fallbackItem.advisorName,
        subtitle: "Academic Advisor",
        email: "not-provided@aastu.edu.et",
        phone: "Not provided",
        location: "AASTU Campus",
        initials: fallbackItem.logoLabel,
      },
    ],
    upcomingEvents: [
      {
        id: "placeholder-event",
        month: "TBD",
        day: "--",
        title: "No scheduled event yet",
        timeVenue: "Add event schedule",
      },
    ],
    recentActivities: [
      {
        id: "placeholder-activity",
        timestamp: "Recently",
        description: "Club profile was generated from summary data.",
      },
    ],
  };
}

export async function generateMetadata({ params }: ClubDetailPageProps): Promise<Metadata> {
  const { clubId } = await params;
  const item = clubDetailItems[clubId] ?? getFallbackClubDetail(clubId);

  return {
    title: item ? item.name : "Club Details",
  };
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId } = await params;
  const item = clubDetailItems[clubId] ?? getFallbackClubDetail(clubId);

  if (!item) {
    return (
      <div className="rounded-[10px] border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Club was not found.
      </div>
    );
  }

  return <ClubDetailView item={item} />;
}
