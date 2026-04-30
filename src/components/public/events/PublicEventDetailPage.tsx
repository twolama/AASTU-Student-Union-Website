import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Users2,
  UserRound,
} from "lucide-react";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { getPublicEvents } from "@/lib/public/events";
import type { PublicEventDetail } from "@/lib/public/events";

interface PublicEventDetailPageProps {
  eventDetail: PublicEventDetail;
}

export function PublicEventDetailPage({ eventDetail }: PublicEventDetailPageProps) {
  const relatedEvents = getPublicEvents()
    .filter((event) => event.id !== eventDetail.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="w-full bg-[#020e34]">
        <article className="relative overflow-hidden text-white">
          <div className="relative h-[230px] sm:h-[260px] lg:h-[300px]">
            <Image
              src={eventDetail.heroImageUrl}
              alt={eventDetail.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,18,63,0.9),rgba(4,18,63,0.24)_66%)]" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto w-full max-w-[1280px] p-4 sm:p-5 lg:p-6">
                <div className="max-w-[920px]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full bg-[#f1c44d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#08143c]">
                      {eventDetail.heroPrimaryTag}
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                      {eventDetail.heroSecondaryTag}
                    </span>
                  </div>

                  <h1 className="mt-3 text-3xl font-black leading-[1.05] text-white sm:text-4xl lg:text-5xl">
                    {eventDetail.title}
                  </h1>

                  <div className="mt-3 grid gap-3 text-xs text-[#d7e1ff] sm:grid-cols-2 sm:text-sm lg:grid-cols-3">
                    <p className="inline-flex items-center gap-2.5">
                      <CalendarDays size={15} className="text-[#f1c44d]" />
                      {eventDetail.dateLabel}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <Clock3 size={15} className="text-[#f1c44d]" />
                      {eventDetail.timeLabel}
                    </p>
                    <p className="inline-flex items-center gap-2.5">
                      <MapPin size={15} className="text-[#f1c44d]" />
                      {eventDetail.venueLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <article>
              <h2 className="text-4xl font-black leading-tight text-[#0f1d49]">About the Event</h2>
              <div 
                className="mt-4 text-[1.05rem] leading-9 text-slate-600 prose prose-slate max-w-none prose-p:leading-9 prose-p:mt-0 prose-p:mb-5"
                dangerouslySetInnerHTML={{ __html: eventDetail.description || eventDetail.aboutParagraphs.join("<br/>") }}
              />

              <blockquote className="mt-6 rounded-[12px] border-l-4 border-[#d2ab42] bg-[#edf0f5] px-5 py-5 text-lg leading-8 text-[#1f2b4e]">
                &quot;{eventDetail.quote}&quot;
              </blockquote>
            </article>

            <article>
              <h2 className="text-4xl font-black leading-tight text-[#0f1d49]">Event Agenda</h2>
              <div className="mt-4 space-y-3">
                {eventDetail.agenda.map((agendaItem) => (
                  <div
                    key={agendaItem.id}
                    className="rounded-[12px] bg-white px-4 py-4 shadow-sm sm:flex sm:items-start sm:gap-6"
                  >
                    <p className="text-sm font-bold text-[#0f1d49] sm:min-w-[82px]">{agendaItem.time}</p>
                    <div className="mt-1 sm:mt-0">
                      <p className="text-lg font-bold text-[#0f1d49]">{agendaItem.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{agendaItem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-5">
            <article className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-3xl font-black text-[#0f1d49]">Event Details</h3>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Organization
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 font-semibold text-[#0f1d49]">
                    <Users2 size={15} className="text-[#b6861f]" />
                    {eventDetail.details.organization}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Capacity
                  </p>
                  <p className="mt-1 font-semibold text-[#0f1d49]">{eventDetail.details.capacity}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Coordinator
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 font-semibold text-[#0f1d49]">
                    <UserRound size={15} className="text-[#b6861f]" />
                    {eventDetail.details.coordinator}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#f1c44d] text-sm font-semibold text-[#0d1a45] transition-colors hover:bg-[#ffd668]"
              >
                Register Now
              </button>

              <button
                type="button"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#eceff5] text-sm font-semibold text-[#0f1d49] transition-colors hover:bg-[#e1e6f0]"
              >
                Inquiry & Support
              </button>
            </article>

            <article className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-3xl font-black text-[#0f1d49]">Venue</h3>

              <div className="mt-4 overflow-hidden rounded-[10px] bg-[#eff2f8]">
                <div className="relative h-[150px]">
                  <Image
                    src={eventDetail.venueCard.mapImageUrl}
                    alt={eventDetail.venueCard.title}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-[#0f1d49]">{eventDetail.venueCard.title}</p>
              <p className="mt-1 text-xs text-slate-500">{eventDetail.venueCard.subtitle}</p>

              <Link
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#b6861f] transition-colors hover:text-[#9f7418]"
              >
                Get Directions
                <ArrowRight size={13} />
              </Link>
            </article>
          </aside>
        </div>

        <section className="rounded-[16px] bg-[#eef1f7] p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-1 rounded-[10px] bg-[#f5f7f9] px-4 py-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0d173c]/50">Waitlist</span>
            <span className="text-xl font-black text-[#0d173c]">{eventDetail.attendance.waitlist}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b6861f]">Discovery</p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-[#0f1d49]">Upcoming Activities</h2>
            </div>

            <Link
              href="/public/events"
              className="text-sm font-semibold text-[#0f1d49] underline decoration-slate-400 underline-offset-4 transition-colors hover:text-[#b6861f]"
            >
              View All Events
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedEvents.map((event) => (
              <article key={event.id} className="overflow-hidden rounded-[14px] bg-white shadow-sm">
                <div className="relative h-40">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-[#0f1d49]">
                    {event.category}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {event.dateMonth} {event.dateDay}, 2024
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-[#0f1d49]">{event.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{event.venue}</p>

                  <Link
                    href={`/public/events/${event.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1d49] transition-colors hover:text-[#b6861f]"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <PublicFooter />
    </main>
  );
}
