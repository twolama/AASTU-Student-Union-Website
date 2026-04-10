import { StatsCard } from "@/components/dashboard/StatsCard";
import { statsCards } from "@/data/dummy";
import { cn } from "@/lib/utils";
import type { StatCard } from "@/types/dashboard";

interface StatsSectionProps {
  items?: StatCard[];
  className?: string;
}

export function StatsSection({ items = statsCards, className }: StatsSectionProps) {
  return (
    <section
      aria-label="Key Statistics"
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}
    >
      {items.map((card) => (
        <StatsCard key={card.id} card={card} />
      ))}
    </section>
  );
}
