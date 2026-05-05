import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { PublicFooter } from "@/components/public/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Home",
  description:
    "AASTU Student Union public portal for clubs, events, and announcements.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3] text-[#14213d]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
