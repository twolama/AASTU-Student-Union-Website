import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UsersContent } from "@/components/dashboard/users/UsersContent";
import { UsersPageActions } from "@/components/dashboard/users/UsersPageActions";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "User Management",
};

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Users</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Efficiently manage student union members and roles across all departments.
          </p>
        </div>

        <UsersPageActions />
      </section>

      <UsersContent />

      <DashboardFooter />
    </div>
  );
}
