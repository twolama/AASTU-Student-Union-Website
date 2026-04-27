import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-10 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c49a22]">404 — Not found</p>
        <h1 className="mt-6 text-5xl font-black text-slate-950">Admin announcement not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The announcement you are trying to access does not exist or has been removed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/announcements"
            className="inline-flex items-center justify-center rounded-[10px] bg-[#08143c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f1d49]"
          >
            Back to Announcements
          </Link>
        </div>
      </div>
    </div>
  );
}
