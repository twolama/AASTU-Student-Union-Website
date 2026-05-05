"use client";

import { PublicAnnouncementsContent } from "@/components/public/announcements/PublicAnnouncementsContent";

export function PublicAnnouncementsPage() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PublicAnnouncementsContent />
    </section>
  );
}
