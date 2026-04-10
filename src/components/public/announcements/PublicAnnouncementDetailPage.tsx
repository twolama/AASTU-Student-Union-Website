import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Mail,
  UserRound,
  Users2,
} from "lucide-react";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { getPublicAnnouncements } from "@/lib/public/announcements";
import type { AnnouncementItem, AnnouncementPreviewData } from "@/types/dashboard";

interface PublicAnnouncementDetailPageProps {
  announcement: AnnouncementPreviewData;
  item: AnnouncementItem;
}

export function PublicAnnouncementDetailPage({ announcement, item }: PublicAnnouncementDetailPageProps) {
  const relatedNotices = getPublicAnnouncements().filter((notice) => notice.id !== item.id).slice(0, 3);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="w-full bg-[#071741]">
        <article className="relative overflow-hidden text-white">
          <div className="relative h-[250px] sm:h-[290px] lg:h-[330px]">
            <Image
              src={announcement.imageUrl}
              alt={announcement.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,63,0.94),rgba(4,18,63,0.22)_68%)]" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto w-full max-w-[1280px] px-4 pb-4 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6">
                <div className="max-w-[940px]">
                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85">
                    <span className="rounded-full bg-[#f1c44d] px-3 py-1 text-[#08143c] font-bold">
                      {announcement.subtitleBadge}
                    </span>
                    <span>{item.publishedAgo}</span>
                  </div>

                  <h1 className="mt-3 text-3xl font-black leading-[1.02] text-white sm:text-4xl lg:text-5xl">
                    {announcement.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#d7e1ff]">
                    <p className="inline-flex items-center gap-2.5">
                      <CalendarDays size={15} className="text-[#f1c44d]" />
                      {announcement.publishedDate}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <Clock3 size={15} className="text-[#f1c44d]" />
                      {announcement.readTime}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <Users2 size={15} className="text-[#f1c44d]" />
                      {announcement.authorRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <article className="rounded-[18px] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-5 text-sm text-slate-500">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1f8] text-[#0f1d49]">
                    <UserRound size={15} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Author</p>
                    <p className="font-semibold text-[#0f1d49]">{announcement.authorName}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1f8] text-[#0f1d49]">
                    <FileText size={15} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Posted</p>
                    <p className="font-semibold text-[#0f1d49]">{announcement.publishedDate}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf4d5] text-[#c49a22]">
                    <Clock3 size={15} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Priority</p>
                    <p className="font-semibold text-[#c49a22]">High Importance</p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                {announcement.introText}
              </p>

              <h2 className="mt-8 text-2xl font-black text-[#0f1d49]">{announcement.timelineHeading}</h2>
              <p className="mt-3 text-[1rem] leading-8 text-slate-600">{announcement.timelineText}</p>

              <div className="mt-6 rounded-[16px] border border-slate-100 bg-[#f7f8fc] p-5">
                <p className="text-sm font-semibold text-[#0f1d49]">Revised Timeline</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {announcement.keyRequirements.map((requirement, index) => (
                    <li key={`${item.id}-requirement-${index}`} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#c49a22]" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="mt-8 text-2xl font-black text-[#0f1d49]">Prerequisites</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                {announcement.procedureSteps.map((step, index) => (
                  <p key={`${item.id}-step-${index}`}>{step}</p>
                ))}
              </div>

              <div className="mt-7 rounded-[14px] bg-[#08143c] p-5 text-sm leading-7 text-[#d7e1ff]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f1c44d]/15 text-[#f1c44d]">
                  <Mail size={14} />
                </span>
                <p className="mt-3">{announcement.supportNote}</p>
              </div>

              <p className="mt-8 text-sm leading-7 text-slate-600">
                Signed,
                <br />
                AASTU Student Union Communications Team
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Share this notice</p>
                <Link href="/public/announcements" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1d49] transition-colors hover:text-[#b6861f]">
                  Back to Announcements
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          </div>

          <aside className="space-y-5">
            <article className="rounded-[18px] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#0f1d49]">Related Notices</h3>

              <div className="mt-5 space-y-4">
                {relatedNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    href={`/public/announcements/${notice.id}`}
                    className="block border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b6861f]">
                      {notice.category === "academic" ? "Campus Life" : notice.category === "social" ? "Student Welfare" : "Financial Aid"}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#0f1d49]">
                      {notice.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{notice.publishedAgo}</p>
                  </Link>
                ))}
              </div>

              <Link
                href="/public/announcements"
                className="mt-5 inline-flex w-full items-center justify-center rounded-[10px] border border-[#0f1d49] px-4 py-2.5 text-sm font-semibold text-[#0f1d49] transition-colors hover:bg-[#f6f7fb]"
              >
                View All Announcements
              </Link>
            </article>

            <article className="overflow-hidden rounded-[18px] bg-[#08143c] p-5 text-white shadow-sm sm:p-6">
              <div className="relative h-36 overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(241,196,77,0.18),transparent_46%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm font-semibold">Student Support Center</p>
                  <p className="mt-2 max-w-[28ch] text-sm leading-7 text-[#c7d3f2]">
                    Need help understanding this notice or finding the right office?
                  </p>
                </div>
              </div>

              <Link
                href="#"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f1c44d] transition-colors hover:text-[#ffd86e]"
              >
                Book an appointment
                <ArrowRight size={14} />
              </Link>
            </article>
          </aside>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
