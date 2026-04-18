import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AnnouncementsPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: AnnouncementsPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => (i + 1).toString());

  return (
    <nav aria-label="Announcements pagination" className="flex items-center justify-center gap-1.5 py-3 sm:gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => {
        const pageNum = parseInt(page);
        const isActive = pageNum === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors",
              isActive
                ? "bg-[#c49a22] text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
        )}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
