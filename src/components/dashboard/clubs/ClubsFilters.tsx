"use client";

import { Tabs } from "@/components/ui/Tabs";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { clubCategoryOptions, clubFilterTabs } from "@/data/dummy";
import type { ClubFilterTab } from "@/types/dashboard";

interface ClubsFiltersProps {
  activeTab: ClubFilterTab["id"];
  onActiveTabChange: (value: ClubFilterTab["id"]) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function ClubsFilters({ activeTab, onActiveTabChange, category, onCategoryChange }: ClubsFiltersProps) {
  return (
    <section className="rounded-[10px] border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          items={clubFilterTabs}
          value={activeTab}
          onValueChange={(value) => onActiveTabChange(value as ClubFilterTab["id"])}
          className="max-w-full border-0 bg-[#f3f5fa] p-1.5 shadow-none"
        />

        <DropdownSelect
          label="Category"
          value={category}
          options={clubCategoryOptions}
          onValueChange={onCategoryChange}
          className="w-full lg:w-[220px]"
        />
      </div>
    </section>
  );
}