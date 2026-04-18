"use client";

import Image from "next/image";
import Link from "next/link";
import { Pin, User, Clock, Edit3, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { type Announcement } from "@/schemas/announcement.schema";
import { useDeleteAnnouncement } from "@/hooks/useAnnouncements";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface AnnouncementCardProps {
  item: Announcement;
}

export function AnnouncementCard({ item }: AnnouncementCardProps) {
  const publishedAt = item.publishedDate || dayjs(item.createdAt).fromNow();
  const deleteMutation = useDeleteAnnouncement();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteMutation.mutateAsync(item.id);
        toast.success("Announcement deleted successfully");
      } catch (error) {
        toast.error("Failed to delete announcement");
      }
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl hover:shadow-gray-200/40 sm:flex-row">
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50 sm:w-64 sm:shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#fdf8ec]">
            <Pin className="h-10 w-10 text-[#c49a22]/10" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isPinned && (
            <Badge className="bg-[#c49a22] text-white shadow-lg shadow-[#c49a22]/30 ring-0">
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.categoryDetails && (
              <Badge variant="outline" className="border-gray-200 text-[#1f2a44] font-bold text-[10px] uppercase tracking-wider">
                {item.categoryDetails.name}
              </Badge>
            )}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <Clock size={12} />
              {publishedAt}
            </div>
          </div>
        </div>

        <Link
          href={`/announcements/${item.id}`}
          className="mb-2 block text-xl font-bold text-[#1f2a44] transition-colors hover:text-[#c49a22]"
        >
          {item.title}
        </Link>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {item.bodyExcerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <User size={12} className="text-[#c49a22]" />
              {item.authorName || item.author.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] font-bold text-[#c49a22]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/announcements/${item.id}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-all hover:bg-[#c49a22]/10 hover:text-[#c49a22]"
              title="View Detail"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/announcements/${item.id}/edit`}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600"
              title="Edit Announcement"
            >
              <Edit3 size={16} />
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Delete Announcement"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
