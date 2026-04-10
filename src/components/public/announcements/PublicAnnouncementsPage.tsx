import { PublicAnnouncementsContent } from "@/components/public/announcements/PublicAnnouncementsContent";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";

export function PublicAnnouncementsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PublicAnnouncementsContent />
      </section>

      <PublicFooter />
    </main>
  );
}
