import { ChartColumn } from "lucide-react";
import type { VenueOccupancyPoint } from "@/types/dashboard";

interface VenueOccupancyTrendsProps {
  points: VenueOccupancyPoint[];
}

export function VenueOccupancyTrends({ points }: VenueOccupancyTrendsProps) {
  const maxValue = Math.max(...points.map((point) => point.value), 100);
  const width = 720;
  const height = 260;
  const paddingX = 24;
  const paddingY = 24;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const coordinates = points.map((point, index) => {
    const x = paddingX + (index / (points.length - 1)) * graphWidth;
    const y = paddingY + (1 - point.value / maxValue) * graphHeight;
    return { ...point, x, y };
  });

  const polylinePoints = coordinates.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
          <ChartColumn size={14} />
        </span>
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f2a44]">Venue Occupancy Trends</h2>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] min-w-[640px] w-full" role="img" aria-label="Venue occupancy trend chart">
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = paddingY + (1 - tick / maxValue) * graphHeight;

            return (
              <g key={tick}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#edf1f7" strokeWidth="1" />
                <text x={6} y={y + 4} className="fill-gray-400 text-[10px]">
                  {tick}%
                </text>
              </g>
            );
          })}

          <polyline points={polylinePoints} fill="none" stroke="#b68b1f" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

          {coordinates.map((point) => (
            <circle key={`${point.day}-${point.value}`} cx={point.x} cy={point.y} r="4" fill="#c49a22" stroke="#fff" strokeWidth="2" />
          ))}

          {coordinates.map((point) => (
            <text key={`label-${point.day}`} x={point.x} y={height - 6} textAnchor="middle" className="fill-gray-400 text-[10px] uppercase tracking-[0.06em]">
              {point.day}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
