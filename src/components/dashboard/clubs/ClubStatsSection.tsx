"use client";

import { ClubStatCard } from "@/components/dashboard/clubs/ClubStatCard";
import { useEffect, useState } from "react";
import { getAnalyticsDashboard } from "@/api/services/analytics.service";

export function ClubStatsSection() {
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getAnalyticsDashboard("last-8-months")
      .then((res) => {
        if (!mounted) return;
        if (res?.forbidden || !res?.data) return;
        const data = res?.data || {};
        const clubStats = data.club_stats || data.clubStats || null;
        if (Array.isArray(clubStats)) {
          setItems(clubStats.map((s: any) => ({ id: s.id, title: s.title, value: s.value, icon: s.icon || 'Users' })));
        }
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const display = items ?? [];

  return (
    <section aria-label="Clubs statistics" className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {display.map((item) => (
        <ClubStatCard key={item.id} item={item} />
      ))}
    </section>
  );
}