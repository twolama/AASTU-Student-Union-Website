"use client";

import { useParams, notFound } from "next/navigation";
import { PublicClubDetailPage } from "@/components/public/clubs/PublicClubDetailPage";
import { useClub, useClubUpcomingEvents } from "@/hooks/useClubs";
import { Loader2 } from "lucide-react";
import type { ClubDetailItem, ClubMemberProfile, ClubUpcomingEventItem } from "@/types/dashboard";
import dayjs from "dayjs";

export default function ClubDetailPage() {
  const params = useParams();
  const clubId = params.clubId as string;

  const { data: club, isLoading, isError } = useClub(clubId);
  const { data: upcomingEventsData } = useClubUpcomingEvents(clubId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f2f2f2]">
        <Loader2 className="h-10 w-10 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  if (isError || !club || club.status !== "active") {
    notFound();
  }

  // Map API data to ClubDetailItem format
  const mappedClub: ClubDetailItem = {
    id: club.id,
    name: club.name,
    status: club.status as any,
    categoryLabel: club.categoryDetails?.name || "General",
    locationLabel: club.locationLabel || "AASTU Campus",
    logoLabel: club.logoLabel || club.name.charAt(0),
    logo: club.logo,
    coverImageUrl: club.coverImage || "/hero_image_aastu_su.jpg",
    about: club.description ? [club.description] : ["No description available."],
    stats: [
      { id: "members", label: "Active Members", value: "0" }, // Placeholder
    ],
    links: {
      website: (club.links as any)?.website || "#",
      membership: (club.links as any)?.membership || "#",
      telegram: (club.links as any)?.telegram || "#",
      linkedin: (club.links as any)?.linkedin || "#",
      github: (club.links as any)?.github || "#",
      youtube: (club.links as any)?.youtube || "#",
    },
    contacts: [
      ...(club.presidentDetails ? [{
        id: club.presidentDetails.id,
        name: club.presidentDetails.name,
        roleLabel: "President",
        subtitle: club.presidentDetails.departmentName || "Student",
        email: club.presidentDetails.email || "No email provided",
        phone: (club.presidentDetails as any).phoneNumber || "No phone provided",
        location: `Block ${club.presidentDetails.dormBlock || "--"}, Room ${club.presidentDetails.dormRoom || "--"}`,
        initials: club.presidentDetails.initials || club.presidentDetails.name.charAt(0),
        avatarUrl: club.presidentDetails.avatar,
      }] : []),
      ...(club.advisorDetails ? [{
        id: club.advisorDetails.id,
        name: club.advisorDetails.name,
        roleLabel: "Advisor",
        subtitle: club.advisorDetails.departmentName || "Faculty",
        email: club.advisorDetails.email || "No email provided",
        phone: (club.advisorDetails as any).phoneNumber || "No phone provided",
        location: "Staff Office",
        initials: club.advisorDetails.initials || club.advisorDetails.name.charAt(0),
        avatarUrl: club.advisorDetails.avatar,
      }] : []),
    ],
    upcomingEvents: (upcomingEventsData || []).map((ev: any) => {
      const startDateTime = ev.startDateTime || ev.start_date_time;
      const dateDay = ev.dateDay || ev.date_day;
      const dateMonth = ev.dateMonth || ev.date_month;
      const venueName = ev.venueName || ev.venue_name || ev.venue || ev.location;

      const start = startDateTime ? dayjs(startDateTime) : null;
      const timeLabel = start ? start.format("HH:mm") : "TBD";

      return {
        id: ev.id,
        day: dateDay || (start ? start.format("DD") : "--"),
        month: dateMonth || (start ? start.format("MMM") : "TBD"),
        title: ev.title,
        timeVenue: `${timeLabel} @ ${venueName || "AASTU"}`,
      };
    }),
    recentActivities: [],
  };

  return <PublicClubDetailPage club={mappedClub} />;
}

