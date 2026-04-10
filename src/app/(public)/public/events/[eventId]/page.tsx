import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicEventDetailPage } from "@/components/public/events/PublicEventDetailPage";
import { getPublicEventDetail, getPublicEvents } from "@/lib/public/events";

interface EventDetailRouteProps {
  params: Promise<{
    eventId: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventDetailRouteProps): Promise<Metadata> {
  const { eventId } = await params;
  const eventDetail = getPublicEventDetail(eventId);

  if (!eventDetail) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: eventDetail.title,
    description: `Details for ${eventDetail.title}.`,
  };
}

export function generateStaticParams() {
  return getPublicEvents().map((event) => ({ eventId: event.id }));
}

export default async function EventDetailPage({ params }: EventDetailRouteProps) {
  const { eventId } = await params;
  const eventDetail = getPublicEventDetail(eventId);

  if (!eventDetail) {
    notFound();
  }

  return <PublicEventDetailPage eventDetail={eventDetail} />;
}
