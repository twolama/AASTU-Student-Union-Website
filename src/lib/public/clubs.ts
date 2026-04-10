import { clubDetailItems, clubItems } from "@/data/dummy";
import type { ClubDetailItem, ClubItem } from "@/types/dashboard";

export function getPublicActiveClubs(): ClubItem[] {
  return clubItems.filter(
    (item) => item.status === "active" && clubDetailItems[item.id]?.status === "active"
  );
}

export function getPublicActiveClubDetail(clubId: string): ClubDetailItem | null {
  const detail = clubDetailItems[clubId];
  if (!detail || detail.status !== "active") {
    return null;
  }
  return detail;
}
