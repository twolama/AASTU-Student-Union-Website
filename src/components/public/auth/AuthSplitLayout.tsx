import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthSplitLayoutProps {
  children: ReactNode;
  panelClassName?: string;
}

export function AuthSplitLayout({ children, panelClassName }: AuthSplitLayoutProps) {
  return (
    <section className="bg-white">
      <div className={cn("mx-auto flex w-full max-w-[1280px] items-center justify-center px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-140px)] lg:px-8 lg:py-12", panelClassName)}>
        <div className="w-full max-w-[470px] rounded-[22px] border border-[#e6ebf2] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:p-7">
          {children}
        </div>
      </div>
    </section>
  );
}