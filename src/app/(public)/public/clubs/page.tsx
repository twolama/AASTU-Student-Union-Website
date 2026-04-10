import type { Metadata } from "next";
import { PublicClubsPage } from "@/components/public/clubs/PublicClubsPage";

export const metadata: Metadata = {
  title: "Clubs",
  description: "Browse active student clubs at AASTU Student Union.",
};

export default function ClubsPage() {
  return <PublicClubsPage />;
}
