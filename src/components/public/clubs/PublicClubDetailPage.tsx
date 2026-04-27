"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Github,
  Youtube,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { cn } from "@/lib/utils";
import type { ClubDetailItem } from "@/types/dashboard";

interface PublicClubDetailPageProps {
  club: ClubDetailItem;
}

export function PublicClubDetailPage({ club }: PublicClubDetailPageProps) {
  const president = club.contacts.find((contact) =>
    contact.roleLabel.toLowerCase().includes("president")
  );
  const advisor = club.contacts.find((contact) =>
    contact.roleLabel.toLowerCase().includes("advisor")
  );

  const connectLinks = [
    { label: "Website", href: club.links.website, icon: Globe },
    { label: "LinkedIn", href: club.links.linkedin || "#", icon: Linkedin },
    { label: "Telegram", href: club.links.telegram || "#", icon: Send },
    { label: "GitHub", href: club.links.github || "#", icon: Github },
    { label: "YouTube", href: club.links.youtube || "#", icon: Youtube },
    { label: "Registration", href: club.links.membership || "#", icon: Mail },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f2f2f2] text-[#14213d]">
      <PublicHeader />

      <section className="w-full overflow-hidden bg-[#02081d]">
        <article className="relative">
          <div className="relative h-[220px] sm:h-[250px] lg:h-[280px]">
            <Image
              src={club.coverImageUrl}
              alt={club.name}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(8,33,120,0.38),rgba(2,8,29,0.88)_68%)]" />

            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-end gap-3 sm:gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white/80 bg-[#1d2b58] text-xl font-black text-[#f1c44d] sm:h-20 sm:w-20 sm:text-2xl">
                    {club.logo ? (
                      <img src={club.logo} alt={club.name} className="h-full w-full object-cover" />
                    ) : (
                      club.logoLabel
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="inline-flex rounded-full bg-[#152a67]/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f1c44d]">
                      {club.categoryLabel}
                    </p>
                    <h1 className="mt-2 text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                      {club.name}
                    </h1>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-200 sm:text-sm">
                      <MapPin size={14} className="text-[#f1c44d]" />
                      {club.locationLabel}
                    </p>
                  </div>
                </div>

                <div className="glow-border-wrapper rounded-[18px] bg-[#02081d]">
                  <a
                    href={club.links.membership}
                    target="_blank"
                    rel="noreferrer"
                    className="glow-border-inner flex h-20 items-center justify-center rounded-[16px] px-10 text-base font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Apply for Membership
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-12">
        <div className="space-y-8">
          <article className="rounded-[16px] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#d2ab42]" />
              <h2 className="text-[2rem] font-black leading-none text-[#101f4a] sm:text-[2.2rem]">
                About the Club
              </h2>
            </div>

            <div
              className="mt-6 prose prose-slate max-w-none text-[15px] leading-8 text-slate-600 
                [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3"
              dangerouslySetInnerHTML={{ __html: club.about[0] }}
            />
          </article>

          {club.upcomingEvents.length > 0 && (
            <article className="rounded-[16px] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-[#d2ab42]" />
                  <h2 className="text-[2rem] font-black leading-none text-[#101f4a] sm:text-[2.2rem]">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  href="/public/events"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#394c7a] hover:text-[#101f4a]"
                >
                  View All
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="mt-5 space-y-4">
                {club.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-4 rounded-[12px] border border-slate-200 bg-[#fafbff] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[10px] bg-[#eef1f8]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          {event.month}
                        </p>
                        <p className="text-3xl font-black leading-none text-[#0f1d49]">
                          {event.day}
                        </p>
                      </div>

                      <div>
                        <p className="text-base font-bold text-[#0f1d49]">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{event.timeVenue}</p>
                      </div>
                    </div>

                    <Link
                      href="/public/events"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ebeff7] text-[#1d2d59] transition-colors hover:bg-[#dce3f3]"
                      aria-label={`View details for ${event.title}`}
                    >
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>

        <aside className="space-y-5">
          <article className="rounded-[16px] bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Club Leadership
            </h3>

            <div className="mt-5 space-y-8">
              {president && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#0f1d49]">
                      {president.avatarUrl ? (
                        <Image src={president.avatarUrl} alt={president.name} fill className="object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                          {president.initials}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#b6861f]">President</p>
                      <p className="text-base font-bold text-[#0f1d49]">{president.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-[#b6861f]" />
                      {president.email}
                    </p>
                    {president.phone && (
                      <p className="flex items-center gap-2">
                        <Phone size={14} className="text-[#b6861f]" />
                        {president.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Connect
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {connectLinks
                .filter((link) => link.href && link.href !== "#")
                .map((linkItem) => {
                  const Icon = linkItem.icon;
                  const isWebsite = linkItem.label === "Website";
                  return (
                    <div key={linkItem.label} className={cn("rounded-[10px] bg-white", isWebsite && "glow-border-wrapper")}>
                      <a
                        href={linkItem.href}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "inline-flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors",
                          isWebsite
                            ? "glow-border-inner text-[#1a2b58] hover:bg-slate-50/10"
                            : "bg-[#f1f3f9] text-[#1a2b58] hover:bg-[#e7ecf8]"
                        )}
                      >
                        <Icon size={14} />
                        {linkItem.label}
                      </a>
                    </div>
                  );
                })}
            </div>
          </article>

          <article className="rounded-[16px] bg-[#041347] p-5 text-white shadow-sm sm:p-6">
            <h3 className="text-2xl font-black">Join Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="inline-flex items-start gap-2 text-sm text-[#d3dcf6]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#f1c44d]" />
                {`Do you want to join ${club.name}?`}
              </li>
            </ul>

            <div className="glow-border-wrapper mt-6 rounded-[12px] bg-[#041347]">
              <a
                href={club.links.membership}
                target="_blank"
                rel="noreferrer"
                className="glow-border-inner flex w-full items-center justify-center rounded-[10px] py-4 text-base font-black text-white transition-colors hover:bg-white/10"
              >
                REGISTER NOW
              </a>
            </div>
          </article>
        </aside>
      </div>

      <PublicFooter />
    </main>
  );
}
