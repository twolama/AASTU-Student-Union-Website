import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatsContent } from "@/components/dashboard/stats/StatsContent";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "Statistics and Reports",
};

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Stats</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Statistics and Reports</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of key statistics, performance trends, and exportable reports.</p>
        </div>
      </section>

      <StatsContent />

      <DashboardFooter />
    </div>
  );
}