"use client";

import { use } from "react";
import { PublicEventDetailPage } from "@/components/public/events/PublicEventDetailPage";

interface EventDetailRouteProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default function EventDetailPage({ params }: EventDetailRouteProps) {
  const { eventId } = use(params);

  return <PublicEventDetailPage eventId={eventId} />;
}
