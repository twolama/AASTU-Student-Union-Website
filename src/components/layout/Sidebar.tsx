"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  CalendarDays,
  Building2,
  BookOpen,
  UserCircle,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems, bottomNavItems } from "@/data/dummy";
import type { NavItem } from "@/types/dashboard";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Megaphone,
  Users,
  CalendarDays,
  Building2,
  BookOpen,
  UserCircle,
  BarChart3,
  Settings,
  LogOut,
};

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavLinkProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}

function NavLink({ item, isCollapsed, isActive, onClick }: NavLinkProps) {
  const Icon = iconMap[item.icon] ?? LayoutDashboard;
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  function updateTooltipPosition() {
    const element = linkRef.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  }

  useEffect(() => {
    if (!isTooltipOpen) {
      return;
    }

    updateTooltipPosition();

    const handleWindowChange = () => updateTooltipPosition();
    window.addEventListener("scroll", handleWindowChange, true);
    window.addEventListener("resize", handleWindowChange);

    return () => {
      window.removeEventListener("scroll", handleWindowChange, true);
      window.removeEventListener("resize", handleWindowChange);
    };
  }, [isTooltipOpen]);

  return (
    <Link
      ref={linkRef}
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => {
        if (isCollapsed) {
          updateTooltipPosition();
          setIsTooltipOpen(true);
        }
      }}
      onMouseLeave={() => setIsTooltipOpen(false)}
      aria-label={item.label}
      className={cn(
        "group relative flex items-center rounded-xl text-[13px] font-medium",
        isCollapsed ? "h-10 w-10 justify-center p-0" : "gap-3 px-3 py-2.5",
        "transition-all duration-150",
        isActive
          ? "bg-[#c49a22] text-white shadow-sm"
          : "text-[#a8b4cc] hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon size={18} className="shrink-0" />

      {/* Label */}
      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {/* Tooltip shown only in collapsed mode */}
      {isCollapsed && isTooltipOpen && typeof document !== "undefined" &&
        createPortal(
          <span
            className="pointer-events-none fixed z-[9999] -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs text-white shadow-lg"
            style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          >
            {item.label}
          </span>,
          document.body
        )}
    </Link>
  );
}

export function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const effectiveCollapsed = isMobileOpen ? false : isCollapsed;

  return (
    <>
      {/* ── Mobile overlay backdrop ──────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/*
       * Sidebar panel
       *
       * Desktop (lg+):
       *   - Sticky so it stays in view while the content column scrolls
       *   - Width controlled by isCollapsed (72px vs 240px) via inline style
       *     to avoid arbitrary Tailwind class scanning issues
       *
       * Mobile (<lg):
       *   - Fixed overlay that slides in from the left
       *   - Width is always 240px
       */}
      <aside
        style={{ width: isMobileOpen ? 240 : isCollapsed ? 72 : 240 }}
        className={cn(
          // Shared base
          "z-40 flex shrink-0 flex-col overflow-hidden bg-[#14213d] transition-all duration-300 ease-in-out",
          // Desktop: sticky sidebar in normal flow
          "hidden lg:flex lg:sticky lg:top-0 lg:h-screen",
          // Mobile: fixed overlay
          isMobileOpen && "fixed inset-y-0 left-0 z-40 flex lg:hidden"
        )}
      >
        {/* ── Logo / Brand ───────────────────────────────── */}
        <div
          className={cn(
            "relative flex flex-col items-center border-b border-white/10 overflow-hidden",
            effectiveCollapsed ? "px-2 py-4" : "gap-4 px-4 py-5"
          )}
        >
          {/* Logo mark */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src="/aastu_logo.jpg"
              alt="AASTU Student Union logo"
              fill
              sizes="40px"
              className="object-contain p-1"
              priority
            />
          </div>

          {/* Brand text — hidden when collapsed */}
          {!effectiveCollapsed && (
            <div className="overflow-hidden text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white leading-tight whitespace-nowrap">
                Student Union
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[#a8b4cc] whitespace-nowrap">
                Admin Dashboard
              </p>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-[#a8b4cc] hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Main navigation ────────────────────────────── */}
        <nav className={cn("flex-1 overflow-y-auto overflow-x-hidden py-5", effectiveCollapsed ? "px-2" : "px-3")}>
          <ul className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <li key={item.id} className={cn(effectiveCollapsed && "flex justify-center")}>
                <NavLink
                  item={item}
                  isCollapsed={effectiveCollapsed}
                  isActive={isActive(item.href)}
                  onClick={onCloseMobile}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Bottom navigation ──────────────────────────── */}
        <div className={cn("border-t border-white/10 py-5", effectiveCollapsed ? "px-2" : "px-3")}>
          <ul className="flex flex-col gap-2.5">
            {bottomNavItems.map((item) => (
              <li key={item.id} className={cn(effectiveCollapsed && "flex justify-center")}>
                <NavLink
                  item={item}
                  isCollapsed={effectiveCollapsed}
                  isActive={isActive(item.href)}
                  onClick={onCloseMobile}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

    </>
  );
}
