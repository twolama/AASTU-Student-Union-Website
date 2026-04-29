import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import type { BookingTab, BookingTabId } from "@/types/dashboard";

interface BookingsTabsProps {
  items: BookingTab[];
  value: BookingTabId;
  onValueChange: (value: BookingTabId) => void;
}

export function BookingsTabs({ items, value, onValueChange }: BookingsTabsProps) {
  const tabItems = items.map((item) => ({
    id: item.id,
    label: item.label,
    badge: item.badge,
  }));

  const activeItem = items.find((item) => item.id === value);

  return (
    <div className="space-y-2" aria-label="Bookings sections">
      <Tabs items={tabItems} value={value} onValueChange={(next) => onValueChange(next as BookingTabId)} />

      {activeItem?.showAdminBadge ? (
        <Badge variant="gold" className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
          Admin queue access
        </Badge>
      ) : null}
    </div>
  );
}
