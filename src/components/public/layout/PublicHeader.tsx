"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import { clubService } from "@/api/services/club.service";
import { eventService } from "@/api/services/event.service";
import { announcementService } from "@/api/services/announcement.service";
import { HeaderAccountMenu } from "@/components/layout/HeaderAccountMenu";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Clubs", href: "/public/clubs" },
  { label: "Events", href: "/public/events" },
  { label: "Announcements", href: "/public/announcements" },
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserQuery = useCurrentUser({
    hydrateFromCache: false,
    staleTimeMs: 0,
    refetchOnMount: "always",
  });
  const isAuthenticated = currentUserQuery.isFetchedAfterMount && Boolean(currentUserQuery.data) && !currentUserQuery.isError;

  const prefetchTargets = useMemo(() => [...navItems.map((item) => item.href), "/login"], []);

  useEffect(() => {
    prefetchTargets.forEach((target) => {
      router.prefetch(target);
    });
  }, [prefetchTargets, router]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["clubs", 1, 100, undefined, "active"],
      queryFn: () => clubService.getClubs(1, 100, undefined, "active"),
    });
    queryClient.prefetchQuery({
      queryKey: ["events", 1, 5, undefined, undefined],
      queryFn: () => eventService.getEvents(1, 5),
    });
    queryClient.prefetchQuery({
      queryKey: ["public-announcements"],
      queryFn: () => announcementService.getAnnouncements(1, 100),
    });
  }, [queryClient]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/aastu_logo.jpg"
              alt="AASTU Student Union"
              width={36}
              height={36}
              className="h-9 w-9 rounded-sm object-cover"
              priority
            />
            <span className="text-sm font-semibold text-[#14213d] sm:text-base">
              Student Union
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => router.prefetch(item.href)}
                onClick={(e) => {
                  if (pathname === item.href) {
                    e.preventDefault();
                  }
                  if (menuOpen) setMenuOpen(false);
                }}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                  isActive(item.href)
                    ? "text-[#c49a22]"
                    : "text-[#14213d]/80 hover:text-[#14213d]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center min-w-[80px] justify-end">
              {isAuthenticated && !pathname.startsWith("/login") && !pathname.startsWith("/sign-up") ? (
                <div className="flex items-center">
                  <HeaderAccountMenu />
                </div>
              ) : (
                <Link
                  href="/login"
                  onMouseEnter={() => router.prefetch("/login")}
                  className="hidden rounded-[4px] bg-[#14213d] px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#1f2f55] lg:inline-flex"
                >
                  Login
                </Link>
              )}
            </div>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-[#14213d] lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-slate-950/35 transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          className={cn(
            "relative h-full w-[82%] max-w-[320px] bg-white p-5 shadow-xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#14213d]">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-[#14213d]"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (pathname === item.href) {
                    e.preventDefault();
                  }
                  setMenuOpen(false);
                }}
                onMouseEnter={() => router.prefetch(item.href)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-[#fdf8ec] text-[#c49a22]"
                    : "text-[#14213d]/85 hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => router.prefetch("/login")}
              className="mt-3 inline-flex items-center justify-center rounded-md bg-[#14213d] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
