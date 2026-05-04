import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import AuthAutoLogout from "@/components/providers/AuthAutoLogout";
import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
//   fallback: ["system-ui", "sans-serif"],
// });

export const metadata: Metadata = {
  title: {
    template: "%s | AASTU Student Union",
    default: "AASTU Student Union",
  },
  description:
    "Official AASTU Student Union platform for clubs, events, announcements, and student engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <QueryProvider>
          <AuthAutoLogout />
          {children}
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
