import { clubStats } from "@/data/dummy";
import { ClubStatCard } from "@/components/dashboard/clubs/ClubStatCard";

export function ClubStatsSection() {
  return (
    <section aria-label="Clubs statistics" className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {clubStats.map((item) => (
        <ClubStatCard key={item.id} item={item} />
      ))}
    </section>
  );
}