"use client";

import { useEffect, useMemo, useState } from "react";
import { AnnouncementTabs } from "@/components/dashboard/announcements/AnnouncementTabs";
import { AnnouncementsList } from "@/components/dashboard/announcements/AnnouncementsList";
import { AnnouncementsPagination } from "@/components/dashboard/announcements/AnnouncementsPagination";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useAnnouncementCategories } from "@/hooks/useAnnouncementCategories";
import { Loader2 } from "lucide-react";

export function AnnouncementsContent() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const { data: annData, isLoading: isAnnLoading, isFetching: isAnnFetching } = useAnnouncements(
    currentPage, 
    limit, 
    activeCategoryId === "all" ? undefined : activeCategoryId,
    selectedStatus === "all" ? undefined : selectedStatus
  );
  const { data: catData } = useAnnouncementCategories({ hasAnnouncements: true });

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setCurrentPage(1);
  };

  const announcements = annData?.data || [];
  const meta = annData?.meta || { page: 1, limit: 9, total: 0, totalPages: 1 };
  const categories = catData?.data || [];

  // Keep hooks consistent across renders
  const categoryIds = useMemo(() => new Set(categories.map((category) => category.slug)), [categories]);

  useEffect(() => {
    if (activeCategoryId !== "all" && !categoryIds.has(activeCategoryId)) {
      setActiveCategoryId("all");
      setCurrentPage(1);
    }
  }, [activeCategoryId, categoryIds]);

  if (isAnnLoading && !annData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  const statusTabs = [
    { id: "all", label: "All Announcements" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Drafts" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <AnnouncementTabs
          tabs={statusTabs}
          activeTabId={selectedStatus}
          onTabChange={handleStatusChange}
        />

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filter by Category</p>
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeCategoryId === "all"
                    ? "border-[#17254c] bg-[#17254c] text-white"
                    : "border-gray-200 bg-[#f8f9fc] text-[#5f6f8d] hover:bg-gray-100"
                }`}
              >
                All Categories
              </button>
            </li>
            {categories.map((cat) => {
              const isActive = cat.slug === activeCategoryId;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(cat.slug || cat.id)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-[#17254c] bg-[#17254c] text-white"
                        : "border-gray-200 bg-[#f8f9fc] text-[#5f6f8d] hover:bg-gray-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={isAnnFetching && annData ? "opacity-60 transition-opacity duration-200" : "transition-opacity duration-200"}>
        <AnnouncementsList items={announcements} />
      </div>

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
