"use client";

import { useMemo } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { type AnnouncementCategory } from "@/schemas/announcement.schema";

interface AnnouncementTabsProps {
  categories: AnnouncementCategory[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export function AnnouncementTabs({ categories, activeTabId, onTabChange }: AnnouncementTabsProps) {
  const tabs = useMemo(() => {
    return [
      { id: "all", label: "All Announcements" },
      ...categories.map(cat => ({
        id: cat.slug,
        label: cat.name
      }))
    ];
  }, [categories]);

  return (
    <Tabs
      items={tabs}
      value={activeTabId}
      onValueChange={onTabChange}
      className="w-full"
    />
  );
}
