"use client";

import { useMemo, useState } from "react";
import { AnnouncementTabs } from "@/components/dashboard/announcements/AnnouncementTabs";
import { AnnouncementsList } from "@/components/dashboard/announcements/AnnouncementsList";
import { AnnouncementsPagination } from "@/components/dashboard/announcements/AnnouncementsPagination";
import { announcementItems, announcementTabs } from "@/data/dummy";

export function AnnouncementsContent() {
  const [activeTabId, setActiveTabId] = useState("all");

  const filteredItems = useMemo(() => {
    if (activeTabId === "all") {
      return announcementItems;
    }

    return announcementItems.filter((item) => item.category === activeTabId);
  }, [activeTabId]);

  return (
    <>
      <AnnouncementTabs
        tabs={announcementTabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
      />

      <AnnouncementsList items={filteredItems} />

      <AnnouncementsPagination />
    </>
  );
}
