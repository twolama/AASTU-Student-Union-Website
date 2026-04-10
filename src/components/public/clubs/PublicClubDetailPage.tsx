import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Instagram,
} from "lucide-react";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import type { ClubDetailItem } from "@/types/dashboard";

interface PublicClubDetailPageProps {
  club: ClubDetailItem;
}

export function PublicClubDetailPage({ club }: PublicClubDetailPageProps) {
  const president =
    club.contacts.find((contact) =>
      contact.roleLabel.toLowerCase().includes("president")
    ) ?? club.contacts[0];

  const missionLead = club.about[0] ?? "";
  const missionBody = club.about.slice(1);

  const joinRequirements = [
    "Enrolled student at AASTU (Any Department)",
    "Maintain a minimum CGPA of 2.75",
    "Passion for technology and problem solving",
  ];

  const connectLinks = [
    { label: "Website", href: club.links.website, icon: Globe },
    { label: "LinkedIn", href: club.links.externalMembership, icon: Linkedin },
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "Telegram", href: "#", icon: Send },
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
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-white/80 bg-[#1d2b58] text-xl font-black text-[#f1c44d] sm:h-20 sm:w-20 sm:text-2xl">
                    {club.logoLabel}
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

                <a
                  href={club.links.externalMembership}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Apply for Membership
                </a>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <article className="rounded-[16px] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#d2ab42]" />
                <h2 className="text-[2rem] font-black leading-none text-[#101f4a] sm:text-[2.2rem]">
                  Our Mission & Vision
                </h2>
              </div>

              <p className="mt-5 text-[15px] leading-8 text-slate-600">{missionLead}</p>

              {missionBody.length > 0 ? (
                <div className="mt-5 space-y-5 text-[15px] leading-8 text-slate-600">
                  <blockquote className="rounded-[12px] border-l-4 border-[#d2ab42] bg-[#f5f7fb] px-5 py-4 text-[#1f2b4e]">
                    &quot;To cultivate a community of visionary engineers who leverage artificial
                    intelligence and robotics to solve complex societal challenges in
                    Ethiopia and beyond.&quot;
                  </blockquote>
                  {missionBody.map((paragraph, index) => (
                    <p key={`${club.id}-about-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </article>

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
          </div>

          <aside className="space-y-5">
            <article className="rounded-[16px] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Leadership
              </h3>

              {president ? (
                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1d49] text-sm font-bold text-white">
                      {president.initials}
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#0f1d49]">{president.name}</p>
                      <p className="text-xs text-slate-500">{president.subtitle}</p>
                    </div>
                  </div>

                  <a
                    href={`mailto:${president.email}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-slate-200 px-3 py-2.5 text-sm font-semibold text-[#1a2b58] transition-colors hover:bg-slate-50"
                  >
                    <Mail size={15} />
                    Contact President
                  </a>
                </div>
              ) : null}

              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Connect
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {connectLinks.map((linkItem) => {
                  const Icon = linkItem.icon;
                  return (
                    <a
                      key={linkItem.label}
                      href={linkItem.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[10px] bg-[#f1f3f9] px-3 py-2 text-sm font-medium text-[#1a2b58] transition-colors hover:bg-[#e7ecf8]"
                    >
                      <Icon size={14} />
                      {linkItem.label}
                    </a>
                  );
                })}
              </div>
            </article>

            <article className="rounded-[16px] bg-[#041347] p-5 text-white shadow-sm sm:p-6">
              <h3 className="text-2xl font-black">Join Us</h3>
              <ul className="mt-4 space-y-3">
                {joinRequirements.map((requirement) => (
                  <li key={requirement} className="inline-flex items-start gap-2 text-sm text-[#d3dcf6]">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#f1c44d]" />
                    {requirement}
                  </li>
                ))}
              </ul>

              <a
                href={club.links.externalMembership}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-[10px] bg-[#f1c44d] px-4 py-3 text-sm font-bold text-[#0d1a46] transition-colors hover:bg-[#ffd66c]"
              >
                REGISTER NOW
              </a>
            </article>
          </aside>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
