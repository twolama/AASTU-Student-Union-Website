"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Pin, Clock } from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { Badge } from "@/components/ui/Badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function RecentAnnouncements() {
  const { data: annData, isLoading } = useAnnouncements(1, 3);

  if (isLoading && !annData) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-gray-100" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const announcements = annData?.data || [];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-50 p-5 px-6">
        <h2 className="text-base font-bold text-[#1f2a44]">Latest Announcements</h2>
        <Link 
          href="/announcements" 
          className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c49a22] transition-colors hover:text-[#b48a1b]"
        >
          View All
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <p className="text-sm text-gray-400">No recent updates available.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <Link
              key={item.id}
              href={`/announcements/${item.id}`}
              className="group flex items-center gap-4 p-5 px-6 transition-colors hover:bg-gray-50/50"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#fdf8ec]">
                    <Pin size={16} className="text-[#c49a22]/30" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-0.5 flex items-center gap-2">
                  {item.isPinned && (
                    <Pin size={10} className="fill-[#c49a22] text-[#c49a22]" />
                  )}
                  <p className="truncate text-sm font-bold text-[#1f2a44] transition-colors group-hover:text-[#c49a22]">
                    {item.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                  <Clock size={10} />
                  {dayjs(item.createdAt).fromNow()}
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="text-[#c49a22]">{item.categoryDetails?.name || 'General'}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      
      {announcements.length > 0 && (
        <div className="bg-gray-50/50 p-4 px-6 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing top {announcements.length} latest updates
          </p>
        </div>
      )}
    </div>
  );
}
