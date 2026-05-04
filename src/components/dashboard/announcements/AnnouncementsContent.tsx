"use client";

import { useEffect, useMemo, useState } from "react";
import { AnnouncementTabs } from "@/components/dashboard/announcements/AnnouncementTabs";
import { AnnouncementsList } from "@/components/dashboard/announcements/AnnouncementsList";
import { AnnouncementsPagination } from "@/components/dashboard/announcements/AnnouncementsPagination";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useAnnouncementCategories } from "@/hooks/useAnnouncementCategories";
import { Loader2 } from "lucide-react";

export function AnnouncementsContent() {
  const [activeTabId, setActiveTabId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const { data: annData, isLoading: isAnnLoading } = useAnnouncements(currentPage, limit, activeTabId);
  const { data: catData } = useAnnouncementCategories({ hasAnnouncements: true });

  // Reset page when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setCurrentPage(1);
  };

  if (isAnnLoading && !annData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  const announcements = annData?.data || [];
  const meta = annData?.meta || { page: 1, limit: 9, total: 0, totalPages: 1 };
  const categories = catData?.data || [];
  const categoryIds = useMemo(() => new Set(categories.map((category) => category.slug)), [categories]);

  useEffect(() => {
    if (activeTabId !== "all" && !categoryIds.has(activeTabId)) {
      setActiveTabId("all");
      setCurrentPage(1);
    }
  }, [activeTabId, categoryIds]);

  return (
    <div className="space-y-6">
      <AnnouncementTabs
        categories={categories}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
      />

      <AnnouncementsList items={announcements} />

      {meta.totalPages > 1 && (
        <AnnouncementsPagination 
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
