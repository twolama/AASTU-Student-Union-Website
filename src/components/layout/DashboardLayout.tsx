"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useSidebar } from "@/hooks/useSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobileOpen, closeMobile } =
    useSidebar();

  function handleToggle() {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleCollapsed();
    } else {
      toggleMobileOpen();
    }
  }

  return (
    /*
     * Outer shell: full-height flex row.
     * On mobile the sidebar is a fixed overlay, so only the content column
     * fills the row. On desktop the sidebar is in-flow.
     */
    <div className="flex min-h-screen bg-[#f5f6fa]">
      {/* ── Sidebar (in-flow on desktop, overlay on mobile) ── */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={closeMobile}
      />

      {/*
       * Content column — takes all remaining width.
       * It is its own flex column so the sticky header stays at the top
       * of *this column* rather than the viewport.
       */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky header inside the content column */}
        <Header onToggleSidebar={handleToggle} />

        {/* Scrollable main area */}
        <main className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
