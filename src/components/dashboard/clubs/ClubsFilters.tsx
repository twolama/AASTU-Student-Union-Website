"use client";

import { useMemo } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { clubCategoryOptions, clubFilterTabs } from "@/data/dummy";
import type { ClubFilterTab } from "@/types/dashboard";
import type { ClubCategory } from "@/schemas/club-category.schema";

interface ClubsFiltersProps {
  activeTab: ClubFilterTab["id"];
  onActiveTabChange: (value: ClubFilterTab["id"]) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories?: ClubCategory[];
}

export function ClubsFilters({ 
  activeTab, 
  onActiveTabChange, 
  category, 
  onCategoryChange,
  categories 
}: ClubsFiltersProps) {
  const options = useMemo(() => {
    if (!categories) return clubCategoryOptions;
    
    const apiOptions = categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    }));

    return [{ value: "all", label: "All Categories" }, ...apiOptions];
  }, [categories]);

  return (
    <div className="space-y-4">
      <div className="rounded-[10px] border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            items={clubFilterTabs}
            value={activeTab}
            onValueChange={(value) => onActiveTabChange(value as ClubFilterTab["id"])}
            className="max-w-full border-0 bg-[#f3f5fa] p-1.5 shadow-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Filter by Category</p>
        <ul className="flex flex-wrap items-center gap-2">
          {options.map((option) => {
            const isActive = option.value === category;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(option.value)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-[#17254c] bg-[#17254c] text-white"
                      : "border-gray-200 bg-[#f8f9fc] text-[#5f6f8d] hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}