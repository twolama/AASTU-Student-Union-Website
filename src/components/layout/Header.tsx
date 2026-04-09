"use client";

import { Bell, Menu } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { currentUser } from "@/data/dummy";

interface HeaderProps {
  onToggleSidebar: () => void;
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c49a22]/20 text-sm font-bold text-[#c49a22] ring-2 ring-[#c49a22]/30">
      {initials}
    </div>
  );
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
      <div className="ml-2 flex shrink-0 items-center gap-3 sm:gap-4">
        {/* Notification bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a22]/40"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#c49a22] ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-400">{currentUser.role}</p>
          </div>
          <UserAvatar name={currentUser.name} />
        </div>
      </div>
    </header>
  );
}
