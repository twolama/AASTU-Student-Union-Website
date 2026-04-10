import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Settings2 } from "lucide-react";
import { UserSettingsContent } from "@/components/dashboard/settings/UserSettingsContent";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "User Settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Settings</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ead9a3] bg-[#fdf8ec] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6c14]">
            <Settings2 size={12} />
            Account settings
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">User Settings</h1>
          <p className="mt-1 text-sm text-gray-500">User settings to manage your account.</p>
        </div>
      </section>

      <UserSettingsContent />

      <DashboardFooter />
    </div>
  );
}