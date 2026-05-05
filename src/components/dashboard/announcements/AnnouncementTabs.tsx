"use client";

import { Tabs } from "@/components/ui/Tabs";

interface AnnouncementTabsProps {
  tabs: { id: string; label: string; badge?: string | number }[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export function AnnouncementTabs({ tabs, activeTabId, onTabChange }: AnnouncementTabsProps) {

  return (
    <Tabs
      items={tabs}
      value={activeTabId}
      onValueChange={onTabChange}
      className="w-full"
    />
  );
}
