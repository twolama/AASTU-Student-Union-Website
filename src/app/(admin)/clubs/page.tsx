import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, PlusCircle } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ClubStatsSection } from "@/components/dashboard/clubs/ClubStatsSection";
import { ClubsContent } from "@/components/dashboard/clubs/ClubsContent";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "Clubs & Organizations",
};

export default function ClubsPage() {
  return (
    <PermissionGate
      anyOf={["clubs.view"]}
      fallback={
        <div className="rounded-[10px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          You do not have permission to view clubs.
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
          <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
            Dashboard
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-500">Clubs</span>
        </nav>

        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Clubs &amp; Organizations
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all student-led activities and registered clubs.
            </p>
          </div>

          <PermissionGate anyOf={["clubs.create"]}>
            <Link
              href="/clubs/new"
              className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[10px] bg-[#c49a22] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b18a1f] sm:self-auto"
            >
              <PlusCircle size={15} />
              Register New Club
            </Link>
          </PermissionGate>
        </section>

        <ClubStatsSection />

        <ClubsContent />

        <DashboardFooter />
      </div>
    </PermissionGate>
  );
}