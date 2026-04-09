import { cn } from "@/lib/utils";

interface DashboardFooterProps {
  organizationName?: string;
  audienceLabel?: string;
  year?: number;
  className?: string;
}

export function DashboardFooter({
  organizationName = "AASTU Student Union",
  audienceLabel = "administrators",
  year = new Date().getFullYear(),
  className,
}: DashboardFooterProps) {
  return (
    <footer className={cn("mt-2 border-t border-gray-100 pt-4 text-center text-xs text-gray-400", className)}>
      © {year} {organizationName}. Designed for {audienceLabel}. All rights reserved.
    </footer>
  );
}
