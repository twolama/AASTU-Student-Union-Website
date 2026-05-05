import type { Metadata } from "next";
import { DashboardOverviewContent } from "@/components/dashboard/DashboardOverviewContent";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default function DashboardPage() {
  return <DashboardOverviewContent />;
}
