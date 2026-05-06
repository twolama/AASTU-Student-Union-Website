import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/layout/PublicHeader";
import { PublicFooter } from "@/components/public/layout/PublicFooter";

export const metadata: Metadata = {
  title: {
    default: "AASTU Student Union",
    template: "%s | AASTU Student Union",
  },
  description:
    "Official portal of the Addis Ababa Science and Technology University Student Union. Explore clubs, upcoming events, and campus announcements.",
  icons: {
    icon: "/aastu_logo.jpg",
    shortcut: "/aastu_logo.jpg",
    apple: "/aastu_logo.jpg",
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
