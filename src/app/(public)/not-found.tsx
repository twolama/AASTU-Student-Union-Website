import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-[#f7f8fc] text-[#14213d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(196,154,34,0.18),transparent_45%),radial-gradient(circle_at_78%_10%,rgba(20,33,61,0.1),transparent_40%)]" />

      <section className="relative mx-auto flex min-h-[68vh] w-full max-w-[1280px] items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl border border-[#e7ebf3] bg-white/95 p-8 text-center shadow-[0_20px_60px_-40px_rgba(20,33,61,0.55)] backdrop-blur md:p-12">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#e8dec0] bg-[#fdf8ec]">
              <Image
                src="/aastu_logo.jpg"
                alt="AASTU"
                width={28}
                height={28}
                className="h-7 w-7 rounded-sm object-cover"
                priority
              />
            </div>
            <span className="rounded-full border border-[#c49a22]/30 bg-[#fdf8ec] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a67f18]">
              Error Page
            </span>
          </div>

          <p className="text-[72px] font-black leading-[0.9] tracking-[-0.05em] text-[#14213d] sm:text-[108px] md:text-[136px]">
            404
          </p>

          <h1 className="mx-auto max-w-[18ch] text-3xl font-semibold leading-tight text-[#14213d] sm:text-4xl md:text-5xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-[58ch] text-sm text-[#51607e] sm:text-base">
            The page you requested does not exist, may have been moved, or the URL might be incorrect.
            You can return to the homepage or continue browsing student union updates.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[420px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#14213d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d2f57] sm:w-auto"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <Link
              href="/public/events"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#c49a22] bg-white px-5 py-2.5 text-sm font-semibold text-[#c49a22] transition-colors hover:bg-[#fdf8ec] sm:w-auto"
            >
              <Compass size={16} />
              Explore events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
