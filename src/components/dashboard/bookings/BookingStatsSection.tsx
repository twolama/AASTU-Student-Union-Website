import { BookingStatCard } from "@/components/dashboard/bookings/BookingStatCard";
import type { BookingStat } from "@/types/dashboard";

interface BookingStatsSectionProps {
  items: BookingStat[];
}

export function BookingStatsSection({ items }: BookingStatsSectionProps) {
  return (
    <section aria-label="Bookings overview statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <BookingStatCard key={item.id} item={item} />
      ))}
    </section>
  );
}
