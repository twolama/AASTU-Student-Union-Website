"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export function BookingsPageActions() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("bookings.create")) {
    return null;
  }

  return (
    <Link
      href="/bookings/new"
      className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:self-auto"
    >
      <Plus size={15} />
      New Booking Request
    </Link>
  );
}