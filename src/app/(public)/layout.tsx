import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "AASTU Student Union public portal for clubs, events, and announcements.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
