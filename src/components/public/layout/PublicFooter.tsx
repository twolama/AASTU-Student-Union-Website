import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Clubs", href: "/public/clubs" },
  { label: "Events", href: "/public/events" },
  { label: "Announcements", href: "/public/announcements" },
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#14213d] text-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-white/95 md:mx-0">
            <Image
              src="/aastu_logo.jpg"
              alt="AASTU"
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
            />
          </div>
          <p className="mx-auto max-w-xs text-sm text-[#c7cfdf] md:mx-0">
            Addis Ababa Science and Technology University Student Union,
            representative voice of the student community.
          </p>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c49a22]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[#c7cfdf]">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c49a22]">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm text-[#c7cfdf]">
            <li>Kilinto, Akaki-Kality Sub-city</li>
            <li>Addis Ababa, Ethiopia</li>
            <li>Phone: +251 118 000 000</li>
            <li>Email: su@aastu.edu.et</li>
          </ul>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c49a22]">
            Connect
          </h3>
          <div className="flex items-center justify-center gap-3 md:justify-start">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center text-[#d4dbeb] transition-colors hover:text-[#c49a22]"
                >
                  <Icon size={15} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-3 px-4 py-5 text-center text-[10px] uppercase tracking-[0.12em] text-[#8d9ab6] sm:px-6 sm:text-[11px] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
          <p className="max-w-[32ch] lg:max-w-none">© 2026 AASTU Student Union. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#" className="transition-colors hover:text-[#cbd4e8]">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-[#cbd4e8]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
