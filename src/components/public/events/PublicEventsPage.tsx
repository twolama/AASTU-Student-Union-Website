"use client";

import { PublicEventsContent } from "@/components/public/events/PublicEventsContent";

export function PublicEventsPage() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PublicEventsContent />
    </section>
  );
}
