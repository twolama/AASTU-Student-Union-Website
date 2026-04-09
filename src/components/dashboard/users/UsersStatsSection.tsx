import { UserStatsCard } from "@/components/dashboard/users/UserStatsCard";
import type { UserManagementStat } from "@/types/dashboard";

interface UsersStatsSectionProps {
  items: UserManagementStat[];
}

export function UsersStatsSection({ items }: UsersStatsSectionProps) {
  return (
    <section aria-label="Users statistics" className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <UserStatsCard key={item.id} item={item} />
      ))}
    </section>
  );
}
