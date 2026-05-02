"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export function UsersPageActions() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("users.create")) {
    return null;
  }

  return (
    <Link
      href="/users/new"
      className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:self-auto"
    >
      <UserPlus size={15} />
      Add New User
    </Link>
  );
}