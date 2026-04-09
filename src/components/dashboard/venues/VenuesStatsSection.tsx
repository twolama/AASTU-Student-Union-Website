import { VenueStatsCard } from "@/components/dashboard/venues/VenueStatsCard";
import type { VenueStat } from "@/types/dashboard";

interface VenuesStatsSectionProps {
  items: VenueStat[];
}

export function VenuesStatsSection({ items }: VenuesStatsSectionProps) {
  return (
    <section aria-label="Venue statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <VenueStatsCard key={item.id} item={item} />
      ))}
    </section>
  );
}
