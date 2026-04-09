"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ClubsFilters } from "@/components/dashboard/clubs/ClubsFilters";
import { ClubCard } from "@/components/dashboard/clubs/ClubCard";
import { clubItems } from "@/data/dummy";
import type { ClubFilterTab } from "@/types/dashboard";

export function ClubsContent() {
  const [activeTab, setActiveTab] = useState<ClubFilterTab["id"]>("all");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return clubItems.filter((item) => {
      const matchesTab = activeTab === "all" ? true : item.status === activeTab;
      const normalizedCategory = item.categoryLabel.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");
      const matchesCategory = category === "all" ? true : normalizedCategory === category;
      return matchesTab && matchesCategory;
    });
  }, [activeTab, category]);

  return (
    <div className="space-y-4">
      <ClubsFilters
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        category={category}
        onCategoryChange={setCategory}
      />

      <section aria-label="Registered clubs" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((club) => (
          <ClubCard key={club.id} item={club} />
        ))}
      </section>

      <div className="flex justify-center pt-4">
        <Button type="button" variant="outline" size="md" className="rounded-full px-6">
          Load More Clubs
          <ChevronDown size={14} />
        </Button>
      </div>
    </div>
  );
}