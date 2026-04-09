import { AnnouncementCard } from "@/components/dashboard/announcements/AnnouncementCard";
import type { AnnouncementItem } from "@/types/dashboard";

interface AnnouncementsListProps {
  items: AnnouncementItem[];
}

export function AnnouncementsList({ items }: AnnouncementsListProps) {
  return (
    <section aria-label="Campus announcements" className="space-y-4">
      {items.map((item) => (
        <AnnouncementCard key={item.id} item={item} />
      ))}
    </section>
  );
}
