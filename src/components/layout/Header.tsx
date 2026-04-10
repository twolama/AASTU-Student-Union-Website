"use client";

import { Menu } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { HeaderNotificationsMenu } from "@/components/layout/HeaderNotificationsMenu";
import { HeaderAccountMenu } from "@/components/layout/HeaderAccountMenu";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    /*
     * Sticky inside the content column — no fixed positioning needed.
     * Stays at the top of the column as the user scrolls the page.
     */
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-5">
      {/* Left block: menu + search */}
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a22]/40"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>
      </div>

      {/* Right actions: always right-aligned */}
      <div className="ml-2  flex shrink-0 items-center gap-3 sm:gap-4">
        <HeaderNotificationsMenu />

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        <HeaderAccountMenu />
      </div>
    </header>
  );
}
