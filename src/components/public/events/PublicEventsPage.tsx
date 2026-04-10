import { PublicEventsContent } from "@/components/public/events/PublicEventsContent";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";

export function PublicEventsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PublicEventsContent />
      </section>

      <PublicFooter />
    </main>
  );
}
