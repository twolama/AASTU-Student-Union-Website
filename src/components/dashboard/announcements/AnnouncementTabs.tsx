import type { AnnouncementTab } from "@/types/dashboard";
import { Tabs } from "@/components/ui/Tabs";

interface AnnouncementTabsProps {
  tabs: AnnouncementTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export function AnnouncementTabs({ tabs, activeTabId, onTabChange }: AnnouncementTabsProps) {
  return <Tabs items={tabs} value={activeTabId} onValueChange={onTabChange} />;
}
