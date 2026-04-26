import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  UserRound,
  Users2,
  Tag,
} from "lucide-react";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import type { Announcement } from "@/schemas/announcement.schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function getPublicAnnouncementSourceLabel(announcement: Announcement) {
  return announcement.authorRoleName || "Official Notice";
}

interface PublicAnnouncementDetailPageProps {
  announcement: Announcement;
  relatedAnnouncements?: Announcement[];
}

export function PublicAnnouncementDetailPage({ announcement, relatedAnnouncements = [] }: PublicAnnouncementDetailPageProps) {
  const publishedAt = dayjs(announcement.createdAt).format("MMM D, YYYY");
  const publishedAgo = dayjs(announcement.createdAt).fromNow();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="w-full bg-[#071741]">
        <article className="relative overflow-hidden text-white">
          <div className="relative h-[250px] sm:h-[290px] lg:h-[330px]">
            {announcement.image ? (
              <Image
                src={announcement.image}
                alt={announcement.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-45"
              />
            ) : (
              <div className="absolute inset-0 bg-[#0a1941]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,63,0.94),rgba(4,18,63,0.22)_68%)]" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto w-full max-w-[1280px] px-4 pb-4 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6">
                <div className="max-w-[940px]">
                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85">
                    {announcement.categoryDetails && (
                      <span className="rounded-full bg-[#f1c44d] px-3 py-1 text-[#08143c] font-bold">
                        {announcement.categoryDetails.name}
                      </span>
                    )}
                    <span>{publishedAgo}</span>
                  </div>

                  <h1 className="mt-3 text-3xl font-black leading-[1.02] text-white sm:text-4xl lg:text-5xl">
                    {announcement.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#d7e1ff]">
                    <p className="inline-flex items-center gap-2.5">
                      <CalendarDays size={15} className="text-[#f1c44d]" />
                      {publishedAt}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <Users2 size={15} className="text-[#f1c44d]" />
                      {announcement.authorRoleName || "Official Notice"}
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
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Originating Body</p>
                    <p className="font-semibold text-[#0f1d49]">{getPublicAnnouncementSourceLabel(announcement)}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf4d5] text-[#c49a22]">
                    <Tag size={15} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Category</p>
                    <p className="font-semibold text-[#c49a22]">{announcement.categoryDetails?.name || "General"}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf4d5] text-[#c49a22]">
                    <Clock3 size={15} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Importance</p>
                    <p className="font-semibold text-[#c49a22]">{announcement.isPinned ? "High Priority" : "Standard"}</p>
                  </div>
                </div>
              </div>

              {/* Rich Text Body */}
              <div 
                className="mt-8 prose prose-slate max-w-none prose-headings:text-[#0f1d49] prose-headings:font-black prose-p:leading-8 prose-p:text-slate-600 prose-a:text-[#c49a22] prose-strong:text-[#0f1d49] prose-ul:list-disc prose-ol:list-decimal"
                dangerouslySetInnerHTML={{ __html: announcement.body || "" }}
              />

              {announcement.procedureSteps && announcement.procedureSteps.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-black text-[#0f1d49] mb-4">Procedure Steps</h2>
                  <div className="space-y-4">
                    {announcement.procedureSteps.map((step, index) => (
                      <div key={index} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0f1d49] text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <p className="text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 mb-8">
                  {announcement.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7f8fc] text-[12px] font-bold text-slate-500 border border-slate-100">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="rounded-[14px] bg-[#08143c] p-6 text-sm leading-7 text-[#d7e1ff]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f1c44d]/15 text-[#f1c44d]">
                      <Mail size={14} />
                    </span>
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">Contact Support</span>
                  </div>
                  <p>
                    If you have questions regarding this announcement, please contact the {getPublicAnnouncementSourceLabel(announcement)} through the official student portal or visit their desk.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Official Notice of AASTU Student Union</p>
                  <Link href="/public/announcements" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1d49] transition-colors hover:text-[#b6861f]">
                    Back to Announcements
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-5">
            {relatedAnnouncements.length > 0 && (
              <article className="rounded-[18px] bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#0f1d49]">Related Notices</h3>

                <div className="mt-5 space-y-4">
                  {relatedAnnouncements.map((notice) => (
                    <Link
                      key={notice.id}
                      href={`/public/announcements/${notice.id}`}
                      className="block border-b border-slate-100 pb-4 last:border-0 last:pb-0 group"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b6861f]">
                        {notice.categoryDetails?.name || "News"}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[#0f1d49] group-hover:text-[#c49a22] transition-colors">
                        {notice.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{dayjs(notice.createdAt).fromNow()}</p>
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
            )}

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
