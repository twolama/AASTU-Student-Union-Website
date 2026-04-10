"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Settings } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { currentUser } from "@/data/dummy";
import { cn } from "@/lib/utils";

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

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors",
          "hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a22]/40",
          open && "bg-gray-50"
        )}
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold leading-tight text-gray-800">{currentUser.name}</p>
          <p className="text-xs text-gray-400">{currentUser.role}</p>
        </div>
        <UserAvatar name={currentUser.name} />
        <ChevronDown
          size={14}
          className={cn("hidden text-gray-400 transition-transform sm:block", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[250px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5">
            <UserAvatar name={currentUser.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{currentUser.name}</p>
              <p className="truncate text-xs text-gray-500">{currentUser.role}</p>
            </div>
          </div>

          <nav className="p-2" aria-label="Account actions">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#fdf8ec] hover:text-[#8c6c14]"
            >
              <Settings size={15} />
              Settings
            </Link>

            <Link
              href="/sign-out"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#fdf8ec] hover:text-[#8c6c14]"
            >
              <LogOut size={15} />
              Sign Out
            </Link>
          </nav>
        </div>
      ) : null}
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

        <AccountMenu />
      </div>
    </header>
  );
}
