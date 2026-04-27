"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ClubDetailView } from "@/components/dashboard/clubs/ClubDetailView";
import { useClub, useClubUpcomingEvents } from "@/hooks/useClubs";
import { Loader2 } from "lucide-react";

interface ClubDetailPageProps {
  params: Promise<{ clubId: string }>;
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId } = use(params);
  const { data: club, isLoading, isError } = useClub(clubId);
  const { data: upcomingEvents, isLoading: isLoadingEvents } = useClubUpcomingEvents(clubId);

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

  // Map backend club data to the UI structure expected by ClubDetailView
  const mappedItem = {
    ...club,
    categoryLabel: club.categoryDetails?.name || club.categoryName || "Uncategorized",
    departmentLabel: (club.departmentDetails as any)?.name || club.departmentName || undefined,
    departmentId: club.department || undefined,
    logo: club.logo,
    coverImageUrl: club.coverImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop",
    logoLabel: club.logoLabel || club.name.charAt(0),
    about: club.description ? [club.description] : ["No description provided."],
    stats: [
      { id: "members", label: "Total Members", value: "0" },
      { id: "events", label: "Events Hosted", value: "0" },
      { id: "rank", label: "Campus Ranking", value: "N/A" },
    ],
    links: {
      website: (club.links as any)?.website || "#",
      externalMembership: (club.links as any)?.membership || "#",
    },
    contacts: [
      {
        id: "president",
        roleLabel: "Club President",
        name: (club.presidentDetails as any)?.name || "Not assigned",
        subtitle: (club.presidentDetails as any)?.departmentName || (club.presidentDetails as any)?.department || "Student Leader",
        email: (club.presidentDetails as any)?.email || "N/A",
        phone: (club.presidentDetails as any)?.phoneNumber || (club.presidentDetails as any)?.phone || "N/A",
        location: (club.presidentDetails as any)?.dormBlock ? `Block ${(club.presidentDetails as any).dormBlock}, Room ${(club.presidentDetails as any).dormRoom}` : "N/A",
        initials: (club.presidentDetails as any)?.initials || (club.presidentDetails as any)?.name?.charAt(0) || "P",
        avatarUrl: (club.presidentDetails as any)?.avatar || null,
      },
      {
        id: "advisor",
        roleLabel: "Club Advisor",
        name: (club.advisorDetails as any)?.name || "Not assigned",
        subtitle: (club.advisorDetails as any)?.departmentName || (club.advisorDetails as any)?.department || "Academic Advisor",
        email: (club.advisorDetails as any)?.email || "N/A",
        phone: (club.advisorDetails as any)?.phoneNumber || (club.advisorDetails as any)?.phone || "N/A",
        location: "N/A",
        initials: (club.advisorDetails as any)?.initials || (club.advisorDetails as any)?.name?.charAt(0) || "A",
        avatarUrl: (club.advisorDetails as any)?.avatar || null,
      },
    ],
    upcomingEvents: (upcomingEvents || []).map((event: any) => ({
      id: event.id,
      month: new Date(event.startDate).toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: new Date(event.startDate).getDate().toString(),
      title: event.title,
      timeVenue: `${new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${event.venueName}`,
    })),
    recentActivities: [], // Not available in the simple API yet
  };

  return <ClubDetailView item={mappedItem as any} />;
}
