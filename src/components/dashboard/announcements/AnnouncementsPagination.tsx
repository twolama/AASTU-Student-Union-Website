import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const pages = ["1", "2", "3", "...", "8"];

export function AnnouncementsPagination() {
  return (
    <nav aria-label="Announcements pagination" className="flex items-center justify-center gap-1.5 py-3 sm:gap-2">
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => {
        const isActive = page === "1";
        const isDots = page === "...";

        return (
          <button
            key={page}
            type="button"
            disabled={isDots}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors",
              isActive
                ? "bg-[#c49a22] text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
              isDots && "cursor-default hover:bg-transparent"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
