"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ClubsFilters } from "@/components/dashboard/clubs/ClubsFilters";
import { ClubCard } from "@/components/dashboard/clubs/ClubCard";
import { useClubs } from "@/hooks/useClubs";
import { useClubCategories } from "@/hooks/useClubCategories";
import type { ClubFilterTab, ClubItem, ClubStatus } from "@/types/dashboard";
import type { Club } from "@/schemas/club.schema";

const getGradientForCategory = (category?: string) => {
  const gradients: Record<string, string> = {
    "Tech": "from-[#2f3d67] to-[#3d4e7f]",
    "Art and sport": "from-[#b38f2b] to-[#c8a13b]",
    "Sports": "from-[#0e1b37] to-[#1c2a4e]",
    "Social Service": "from-[#864040] to-[#a04f4f]",
  };
  return gradients[category || ""] || "from-[#1f2a44] to-[#2f3d67]";
};

const mapClubToItem = (club: Club): ClubItem => ({
  id: club.id,
  name: club.name,
  categoryLabel: club.categoryName || "Uncategorized",
  status: (club.status as ClubStatus) || "active",
  presidentName: club.presidentName || "N/A",
  advisorName: club.advisorName || "N/A",
  headerGradient: getGradientForCategory(club.categoryName || undefined),
  logoLabel: club.logoLabel || club.name.charAt(0),
  logo: club.logo,
  coverImage: club.coverImage,
  departmentId: club.department || undefined,
  departmentName: club.departmentName || undefined,
});

export function ClubsContent() {
  const [activeTab, setActiveTab] = useState<ClubFilterTab["id"]>("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: clubsData, isLoading, isError } = useClubs(page, 20, category);
  const { data: categoriesData } = useClubCategories();

  const clubs = useMemo(() => {
    if (!clubsData?.data) return [];
    
    return clubsData.data
      .filter((item) => (activeTab === "all" ? true : item.status === activeTab))
      .map(mapClubToItem);
  }, [clubsData, activeTab]);

  const hasMore = clubsData?.meta ? clubsData.meta.page < clubsData.meta.totalPages : false;

  return (
    <div className="space-y-4">
      <ClubsFilters
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1); // Reset page when category changes
        }}
        categories={categoriesData}
      />

      {isLoading && page === 1 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 bg-gray-50 text-gray-500">
          <p>Failed to load clubs. Please try again later.</p>
        </div>
      ) : clubs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 bg-gray-50 text-gray-500">
          <p>No clubs found matching your criteria.</p>
        </div>
      ) : (
        <section aria-label="Registered clubs" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard key={club.id} item={club} />
          ))}
        </section>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            type="button" 
            variant="outline" 
            size="md" 
            className="rounded-full px-6"
            onClick={() => setPage(prev => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load More Clubs
            <ChevronDown size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}