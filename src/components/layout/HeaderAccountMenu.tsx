"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderUserAvatar } from "@/components/layout/HeaderUserAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthLogout } from "@/hooks/useAuthLogout";

export function HeaderAccountMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentUserQuery = useCurrentUser();
  const logoutMutation = useAuthLogout();

  const displayName = currentUserQuery.data?.name ?? "User";
  const displayRole = currentUserQuery.data?.roleDetails?.name ?? currentUserQuery.data?.role ?? "Member";

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

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      queryClient.removeQueries({ queryKey: ["auth"] });
      setOpen(false);
      router.replace("/login");
      router.refresh();
    }
  }

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
          <p className="text-sm font-semibold leading-tight text-gray-800">{displayName}</p>
          <p className="text-xs text-gray-400">{displayRole}</p>
        </div>
        <HeaderUserAvatar name={displayName} src={currentUserQuery.data?.avatar} />
        <ChevronDown
          size={14}
          className={cn("hidden text-gray-400 transition-transform sm:block", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[250px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5">
            <HeaderUserAvatar name={displayName} src={currentUserQuery.data?.avatar} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="truncate text-xs text-gray-500">{displayRole}</p>
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

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#fdf8ec] hover:text-[#8c6c14]"
            >
              <LogOut size={15} />
              {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}