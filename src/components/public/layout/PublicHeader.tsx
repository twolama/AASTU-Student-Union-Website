"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Clubs", href: "/clubs" },
  { label: "Events", href: "/events" },
  { label: "Announcements", href: "/announcements" },
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                  item.href === "/"
                    ? "text-[#c49a22]"
                    : "text-[#14213d]/80 hover:text-[#14213d]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden rounded-[4px] bg-[#14213d] px-6 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1f2f55] lg:inline-flex"
            >
              Login
            </Link>
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
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  item.href === "/"
                    ? "bg-[#fdf8ec] text-[#c49a22]"
                    : "text-[#14213d]/85 hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
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
