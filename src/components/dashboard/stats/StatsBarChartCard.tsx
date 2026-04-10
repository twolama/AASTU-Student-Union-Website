import { ChartColumn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatsTrendPoint } from "@/types/dashboard";

interface StatsBarChartCardProps {
  title: string;
  subtitle: string;
  points: StatsTrendPoint[];
  footerItems?: Array<{ label: string; value: string }>;
  className?: string;
}

export function StatsBarChartCard({ title, subtitle, points, footerItems, className }: StatsBarChartCardProps) {
  const maxValue = Math.max(...points.map((point) => point.value), 100);
  const width = 720;
  const height = 280;
  const paddingX = 24;
  const paddingTop = 20;
  const paddingBottom = 34;
  const chartHeight = height - paddingTop - paddingBottom;
  const step = points.length > 0 ? (width - paddingX * 2) / points.length : 0;
  const barWidth = Math.min(54, step * 0.62);

  const bars = points.map((point, index) => {
    const normalizedHeight = (point.value / maxValue) * chartHeight;
    const x = paddingX + index * step + (step - barWidth) / 2;
    const y = paddingTop + (chartHeight - normalizedHeight);

    return {
      ...point,
      x,
      y,
      height: normalizedHeight,
      width: barWidth,
    };
  });

  const average = Math.round(points.reduce((sum, point) => sum + point.value, 0) / Math.max(points.length, 1));
  const peakPoint = points.reduce((highest, point) => (point.value > highest.value ? point : highest), points[0] ?? { label: "", value: 0 });

  return (
    <section className={cn("rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fdf8ec] text-[#c49a22] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <ChartColumn size={18} />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-gray-900">{title}</p>
            <p className="mt-1 max-w-xl text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">Live trend</p>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] min-w-[640px] w-full" role="img" aria-label={title}>
          <defs>
            <linearGradient id="stats-bar-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ead7a3" />
              <stop offset="100%" stopColor="#f8f1df" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((tick) => {
            const y = paddingTop + chartHeight - (tick / maxValue) * chartHeight;

            return (
              <g key={tick}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#edf1f7" strokeWidth="1" />
                <text x={6} y={y + 4} className="fill-gray-400 text-[10px]">
                  {tick}
                </text>
              </g>
            );
          })}

          {bars.map((bar) => (
            <g key={bar.label}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx="14"
                fill="url(#stats-bar-gradient)"
                stroke="#d5b567"
                strokeWidth="1.2"
              />
              <rect
                x={bar.x + 4}
                y={bar.y + 4}
                width={bar.width - 8}
                height={Math.max(bar.height - 8, 0)}
                rx="10"
                fill="#f9f1da"
                opacity="0.75"
              />
              <text
                x={bar.x + bar.width / 2}
                y={height - 10}
                textAnchor="middle"
                className="fill-gray-400 text-[10px] uppercase tracking-[0.08em]"
              >
                {bar.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-3.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Peak month</p>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {peakPoint.label} <span className="text-[#c49a22]">{peakPoint.value}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-3.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Average</p>
          <p className="mt-2 text-sm font-semibold text-gray-900">{average} registrations</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-3.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Window</p>
          <p className="mt-2 text-sm font-semibold text-gray-900">{points.length} reporting points</p>
        </div>
      </div>

      {footerItems?.length ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {footerItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}