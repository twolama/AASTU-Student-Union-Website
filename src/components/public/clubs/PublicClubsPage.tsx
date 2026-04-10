import { PublicClubsContent } from "@/components/public/clubs/PublicClubsContent";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { getPublicActiveClubs } from "@/lib/public/clubs";

export function PublicClubsPage() {
  const activeClubs = getPublicActiveClubs();

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />

      <section className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <PublicClubsContent clubs={activeClubs} />
      </section>

      <PublicFooter />
    </main>
  );
}
