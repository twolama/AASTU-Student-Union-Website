"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { Button } from "@/components/ui/Button";
import { Calendar, CheckCircle2, CircleAlert, Clock3, Printer, Share2, TriangleAlert, Pin, User } from "lucide-react";
import { type Announcement } from "@/schemas/announcement.schema";
import dayjs from "dayjs";

interface AnnouncementPreviewContentProps {
  item: Announcement;
}

export function AnnouncementPreviewContent({ item }: AnnouncementPreviewContentProps) {
  const publishedAt = dayjs(item.createdAt).format("MMMM D, YYYY");

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <span>›</span>
        <Link href="/announcements" className="text-gray-500 hover:text-gray-700">
          Announcements
        </Link>
        <span>›</span>
        <span className="font-medium text-gray-500">{item.id.substring(0, 8).toUpperCase()}</span>
      </nav>

      <article className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="relative h-[260px] w-full sm:h-[320px] bg-gray-50">
          {item.image ? (
            <Image src={item.image} alt={item.title} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#fdf8ec]">
              <Pin className="h-20 w-20 text-[#c49a22]/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#1a1a2ecc] via-[#1a1a2e70] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="flex flex-wrap gap-2 mb-3">
              {item.isPinned && (
                <Badge className="rounded-[6px] bg-[#c49a22] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {item.categoryDetails && (
                <Badge className="rounded-[6px] bg-white text-[#1f2a44] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
                  {item.categoryDetails.name}
                </Badge>
              )}
            </div>
            <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {item.title}
            </h1>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fdf8ec] text-[#c49a22]">
                <User size={14} />
              </span>
              <div>
                <p className="text-sm font-bold text-[#1f2a44]">{item.authorName || item.author.name}</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {item.authorRoleName || "Official"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar size={14} className="text-[#c49a22]" />
                {publishedAt}
              </span>
              {item.publishedDate && (
                <span className="hidden sm:inline-flex items-center gap-1.5 font-medium">
                  <Clock3 size={14} className="text-[#c49a22]" />
                  {item.publishedDate}
                </span>
              )}
            </div>
          </div>

          {/* Intro/Excerpt */}
          <div className="border-l-4 border-[#c49a22] pl-6 text-xl leading-relaxed text-[#1e2a42] italic">
            {item.bodyExcerpt}
          </div>

          {/* Main Body Content */}
          <div 
            className="prose prose-slate max-w-none text-gray-600 leading-8"
            dangerouslySetInnerHTML={{ __html: item.body || "" }}
          />

          {/* Procedure Steps (if any) */}
          {item.procedureSteps && item.procedureSteps.length > 0 && (
            <section className="rounded-[10px] border border-gray-200 bg-[#fcfcfd] p-6 shadow-sm">
              <h3 className="inline-flex items-center gap-2 mb-4 text-2xl font-bold tracking-tight text-[#1f2a44]">
                <TriangleAlert size={20} className="text-[#c49a22]" />
                Procedure Steps
              </h3>
              <ul className="space-y-4">
                {item.procedureSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-sm text-gray-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c49a22] text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="space-y-6 border-t border-gray-200 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-gray-400 tracking-widest mr-2">Tags:</span>
              {item.tags?.map((tag) => (
                <span key={tag} className="rounded-md bg-[#f4f6fb] px-2.5 py-1 text-[11px] font-bold text-[#4f648d]">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-[8px] h-9 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Share2 size={14} className="mr-2" />
                  Share
                </Button>
                <Button type="button" variant="outline" size="sm" className="rounded-[8px] h-9 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Printer size={14} className="mr-2" />
                  Print
                </Button>
              </div>

              <Button type="button" variant="ghost" size="sm" className="rounded-[8px] text-gray-400 hover:text-gray-600">
                <CircleAlert size={14} className="mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </article>

      <DashboardFooter />
    </div>
  );
}