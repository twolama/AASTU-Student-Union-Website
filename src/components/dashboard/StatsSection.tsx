import { StatsCard } from "@/components/dashboard/StatsCard";
import { statsCards } from "@/data/dummy";

export function StatsSection() {
  return (
    <section aria-label="Key Statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statsCards.map((card) => (
        <StatsCard key={card.id} card={card} />
      ))}
    </section>
  );
}
