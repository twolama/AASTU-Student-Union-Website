import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { Button } from "@/components/ui/Button";
import { Calendar, CheckCircle2, CircleAlert, Clock3, Printer, Share2, TriangleAlert } from "lucide-react";
import type { AnnouncementPreviewData } from "@/types/dashboard";

interface AnnouncementPreviewContentProps {
  item: AnnouncementPreviewData;
}

export function AnnouncementPreviewContent({ item }: AnnouncementPreviewContentProps) {
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
        <span className="font-medium text-gray-500">{item.id.toUpperCase()}</span>
      </nav>

      <article className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="relative h-[260px] w-full sm:h-[320px]">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2ecc] via-[#1a1a2e70] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <Badge variant="gold" className="mb-3 rounded-[6px] bg-[#c49a22] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
              {item.subtitleBadge}
            </Badge>
            <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {item.title}
            </h1>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <p className="text-sm font-medium text-[#c49a22]">#{item.authorName}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {item.publishedDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {item.readTime}
              </span>
            </div>
          </div>

          <div className="border-l-4 border-[#c49a22] pl-4 text-2xl leading-10 text-[#1e2a42] sm:text-[34px] sm:leading-[1.35]">
            {item.introText}
          </div>

          <section>
            <h2 className="text-3xl font-bold tracking-tight text-[#1f2a44]">{item.timelineHeading}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">{item.timelineText}</p>
          </section>

          <section className="rounded-[10px] border border-gray-200 bg-[#fcfcfd] p-5">
            <h3 className="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-[#1f2a44]">
              <TriangleAlert size={20} className="text-[#c49a22]" />
              Key Requirements
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
              {item.keyRequirements.map((requirement) => (
                <li key={requirement} className="inline-flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="mt-0.5 text-[#3cb371]" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold tracking-tight text-[#1f2a44]">Step-by-Step Procedure</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-gray-700">
              {item.procedureSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="inline-flex w-full items-start gap-2 rounded-[10px] border border-[#efe6c9] bg-[#fcfaf4] px-4 py-3 text-sm text-gray-600">
            <CircleAlert size={16} className="mt-0.5 shrink-0 text-[#c49a22]" />
            <p>{item.supportNote}</p>
          </section>

          <div className="space-y-6 border-t border-gray-200 pt-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-[#f4f6fb] px-2.5 py-1 font-medium text-[#4f648d]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" className="rounded-[8px]">
                  <Share2 size={14} />
                  Share
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-[8px]">
                  <Printer size={14} />
                  Print
                </Button>
              </div>

              <Button type="button" variant="ghost" size="sm" className="rounded-[8px] text-gray-500">
                <CircleAlert size={14} />
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