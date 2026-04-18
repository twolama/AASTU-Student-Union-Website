"use client";

import { AnnouncementCard } from "@/components/dashboard/announcements/AnnouncementCard";
import { type Announcement } from "@/schemas/announcement.schema";

interface AnnouncementsListProps {
  items: Announcement[];
}

export function AnnouncementsList({ items }: AnnouncementsListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
        <p className="text-gray-400 font-medium">No announcements found in this category.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <AnnouncementCard key={item.id} item={item} />
      ))}
    </div>
  );
}
