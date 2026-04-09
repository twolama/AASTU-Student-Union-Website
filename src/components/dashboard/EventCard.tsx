import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Event } from "@/types/dashboard";

interface EventCardProps {
  event: Event;
}

// Generates a deterministic hue from name string for avatar fallback
function nameToHue(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function EventCard({ event }: EventCardProps) {
  const extra = event.attendeeCount - event.attendees.length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative h-[180px] w-full overflow-hidden bg-gray-100">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Date badge overlay */}
        <div className="absolute left-3 top-3">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-sm">
            {event.dateLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
        <h3 className="font-semibold text-gray-900 leading-snug">{event.title}</h3>

        <div className="flex items-center gap-1.5 text-xs text-[#c49a22]">
          <MapPin size={12} />
          <span>{event.venue}</span>
        </div>

        {/* Footer row */}
        <div className="mt-2 flex items-center justify-between">
          {/* Attendee avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {event.attendees.slice(0, 3).map((a) => {
                const hue = nameToHue(a.name);
                const initials = a.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);
                return (
                  <div
                    key={a.id}
                    title={a.name}
                    className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white text-[10px] font-bold text-white"
                    style={{ backgroundColor: `hsl(${hue},55%,52%)` }}
                  >
                    {initials}
                  </div>
                );
              })}
            </div>
            {extra > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                +{extra}
              </span>
            )}
          </div>

          <Button variant="gold" size="sm">
            Manage
          </Button>
        </div>
      </div>
    </article>
  );
}
