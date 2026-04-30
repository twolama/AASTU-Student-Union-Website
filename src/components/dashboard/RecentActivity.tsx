import Link from "next/link";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { recentActivities } from "@/data/dummy";
import type { Activity } from "@/types/dashboard";

interface RecentActivityProps {
  items?: Activity[];
}

export function RecentActivity({ items = recentActivities }: RecentActivityProps) {
  return (
    <section
      aria-label="Recent Activity"
      className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
        <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
        <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
          Clear All
        </button>
      </div>

      {/* Activity list */}
      <ul className="divide-y divide-gray-50 px-5">
        {items.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="border-t border-gray-100 px-5 py-4 text-center">
        {/* <Link
          href="/activity"
          className="text-sm font-medium text-[#c49a22] hover:text-[#a07d15] transition-colors"
        >
          View Full Activity Log
        </Link> */}
      </div>
    </section>
  );
}
