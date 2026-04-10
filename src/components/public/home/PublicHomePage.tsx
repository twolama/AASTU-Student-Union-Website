import { HomeHero } from "@/components/public/home/HomeHero";
import { PublicFooter } from "@/components/public/layout/PublicFooter";
import { PublicHeader } from "@/components/public/layout/PublicHeader";

export function PublicHomePage() {
  return (
    <main className="min-h-screen bg-white text-[#14213d]">
      <PublicHeader />
      <HomeHero />
      <PublicFooter />
    </main>
  );
}
