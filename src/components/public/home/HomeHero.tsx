import Link from "next/link";
import Image from "next/image";

export function HomeHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid w-full max-w-[1440px] lg:min-h-[760px] lg:grid-cols-[58%_42%]">
        <div className="relative min-h-[360px] overflow-hidden bg-[#163962] sm:min-h-[480px] lg:min-h-[760px]">
          <Image
            src="/vlong.png"
            alt="AASTU campus"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_18%,rgba(255,255,255,0.14),transparent_54%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,33,70,0.08),rgba(16,33,70,0.56))]" />

          <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-gradient-to-t from-[#14213d]/90 to-transparent" />

          <div className="absolute bottom-8 left-5 right-5 flex items-end sm:bottom-10 sm:left-8 sm:right-8 lg:bottom-12 lg:left-10 lg:right-10">
            <div className="w-full border-l-2 border-[#c49a22] pl-4 text-white">
              <p className="text-[10px] uppercase tracking-[0.38em] text-white/75">
                Established 2011
              </p>
              <p className="mt-2 text-xl font-semibold sm:text-2xl">
                University for Industry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-[#f8f8fb] px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[470px] lg:mx-0">
            <div className="mb-8 h-[4px] w-16 bg-[#c49a22]" />
            <h1
              className="text-balance text-4xl font-semibold leading-[1.08] text-[#14213d] sm:text-[3.25rem]"
              style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
            >
              Shaping the Future of <span className="text-[#c49a22]">Innovation.</span>
            </h1>
            <p className="mt-6 max-w-[36ch] text-base leading-8 text-slate-600 sm:text-lg">
              Empowering the next generation of Ethiopian engineers and
              technologists through leadership, community, and creative
              excellence.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/public/clubs"
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#c49a22] px-8 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,154,34,0.28)] transition-colors hover:bg-[#b58d20]"
              >
                Join Clubs
              </Link>
              <Link
                href="/public/events"
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-[#14213d] px-8 text-sm font-semibold text-[#14213d] transition-colors hover:bg-[#e9edf7]"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
