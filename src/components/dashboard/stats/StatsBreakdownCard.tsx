import { PieChart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { StatsBreakdownItem } from "@/types/dashboard";

interface StatsBreakdownCardProps {
  title: string;
  subtitle: string;
  items: StatsBreakdownItem[];
  footerNote?: string;
  showDonut?: boolean;
  donutLabel?: string;
  className?: string;
}

const toneBadgeClasses = {
  positive: "success",
  neutral: "info",
  warning: "warning",
} as const;
export function StatsBreakdownCard({
  title,
  subtitle,
  items,
  footerNote,
  showDonut = false,
  donutLabel = "Total",
  className,
}: StatsBreakdownCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  const dominantItem = items.reduce((highest, item) => (item.value > highest.value ? item : highest), items[0]);

  let accumulated = 0;
  const stops = items
    .map((item) => {
      const start = accumulated;
      const size = (item.value / total) * 100;
      accumulated += size;
      return `${item.color} ${start}% ${accumulated}%`;
    })
    .join(", ");

  return (
    <section className={cn("rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fdf8ec] text-[#c49a22] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <PieChart size={18} />
        </span>
        <div>
          <p className="text-lg font-bold tracking-tight text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      {showDonut ? (
        <div className="mt-5 grid gap-5 xl:grid-cols-[160px_minmax(0,1fr)] xl:items-center">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full sm:h-44 sm:w-44" style={{ background: `conic-gradient(${stops})` }}>
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-gray-100 bg-white text-center shadow-sm sm:h-28 sm:w-28">
              <p className="text-3xl font-bold tracking-tight text-[#1f2a44]">{total}</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">{donutLabel}</p>
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            {items.map((item) => {
              const percent = Math.round((item.value / total) * 100);

              return (
                <div key={item.id} className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-3.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Dominant segment</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{dominantItem.label}</p>
                </div>
                <Badge variant="gold">{Math.round((dominantItem.value / total) * 100)}%</Badge>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => {
            const percent = Math.round((item.value / total) * 100);

            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-900">{percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm text-gray-500">
        <span>{footerNote ?? `${items.length} categories tracked.`}</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[#8c6c14]">
          <span className="h-2 w-2 rounded-full bg-[#c49a22]" />
          Updated for the selected period
        </span>
      </div>
    </section>
  );
}