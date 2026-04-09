import { EventStatsCard } from "@/components/dashboard/events/EventStatsCard";
import type { EventManagementStat } from "@/types/dashboard";

interface EventsStatsSectionProps {
  items: EventManagementStat[];
}

export function EventsStatsSection({ items }: EventsStatsSectionProps) {
  return (
    <section aria-label="Event statistics" className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <EventStatsCard key={item.id} item={item} />
      ))}
    </section>
  );
}
