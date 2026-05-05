"use client";

import { useMemo, useState, useEffect } from "react";
import { /* Download */ } from "lucide-react";
import { ApiError } from "@/api/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { VenueOccupancyTrends } from "@/components/dashboard/events/VenueOccupancyTrends";
import { statsPeriods } from "@/data/dummy";
import { getAnalyticsDashboard } from "@/api/services/analytics.service";
import type { StatCard, StatsBreakdownItem, StatsRangeId, StatsTrendPoint } from "@/types/dashboard";
import { StatsBarChartCard } from "@/components/dashboard/stats/StatsBarChartCard";
import { StatsBreakdownCard } from "@/components/dashboard/stats/StatsBreakdownCard";

type VenueKpis = {
  mostPopular?: string;
  avgSessionHours?: number;
};

type DashboardData = {
  registrationTrends?: StatsTrendPoint[];
  occupancyTrends?: StatsTrendPoint[];
  clubBreakdown?: StatsBreakdownItem[];
  eventDistribution?: StatsBreakdownItem[];
  overview?: StatCard[];
  venueKpis?: VenueKpis;
};

type AnalyticsResponse = {
  forbidden?: boolean;
  data?: DashboardData | null;
};

export function StatsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsRangeId>("last-8-months");
  const [loading, setLoading] = useState(true);
  const [requestNonce, setRequestNonce] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    let mounted = true;
    getAnalyticsDashboard(selectedPeriod)
      .then((data) => {
        if (!mounted) return;
        const payload = data as AnalyticsResponse;
        if (payload?.forbidden || !payload?.data) {
          setDashboard(null);
          return;
        }
        setDashboard(payload.data);
      })
      .catch((error) => {
        if (!mounted) return;
        setDashboard(null);
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
          return;
        }
        setErrorMessage("Unable to load analytics right now. Please try again.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedPeriod, requestNonce]);

  const selectedPeriodOption = statsPeriods.find((item) => item.id === selectedPeriod) ?? statsPeriods[0];

  const registrationPoints = useMemo(() => dashboard?.registrationTrends ?? [], [dashboard]);
  const occupancyPoints = useMemo(() => dashboard?.occupancyTrends ?? [], [dashboard]);
  const clubBreakdown = useMemo(() => dashboard?.clubBreakdown ?? [], [dashboard]);
  const eventDistribution = useMemo(() => dashboard?.eventDistribution ?? [], [dashboard]);
  const overviewCards = useMemo(() => dashboard?.overview ?? [], [dashboard]);
  const venueKpis = dashboard?.venueKpis || {};

  const registrationsSummary = useMemo(() => {
    const firstValue = registrationPoints[0]?.value ?? 0;
    const lastValue = registrationPoints[registrationPoints.length - 1]?.value ?? 0;
    const peakPoint = registrationPoints.reduce(
      (highest, point) => (point.value > highest.value ? point : highest),
      registrationPoints[0] ?? { label: "", value: 0 }
    );
    const momentum = firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;
    return {
      peakPoint,
      average: Math.round(registrationPoints.reduce((sum, point) => sum + point.value, 0) / Math.max(registrationPoints.length, 1)),
      momentum,
    };
  }, [registrationPoints]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading analytics...</div>;
  }

  if (!dashboard) {
    return (
      <div className="rounded-[22px] border border-amber-200 bg-amber-50/60 p-6 text-center">
        <p className="text-sm text-amber-900">{errorMessage || "Analytics are temporarily unavailable."}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => {
            setErrorMessage(null);
            setLoading(true);
            setRequestNonce((prev) => prev + 1);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="gold">Analytics snapshot</Badge>
            <h2 className="mt-3 text-lg font-bold tracking-tight text-gray-900">Reporting controls</h2>
            <p className="mt-1 text-sm text-gray-500">{selectedPeriodOption.description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <DropdownSelect
              label="Reporting period"
              value={selectedPeriod}
              options={statsPeriods.map((period) => ({ value: period.id, label: period.label }))}
              onValueChange={(value) => {
                setErrorMessage(null);
                setLoading(true);
                setSelectedPeriod(value as StatsRangeId);
              }}
              className="min-w-[220px]"
            />
            
          </div>
        </div>
      </section>

      <StatsSection items={overviewCards} className="xl:grid-cols-4" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <StatsBarChartCard
          title="Student Registration Trends"
          subtitle="User enrollment overview for the selected reporting window."
          points={registrationPoints}
          footerItems={[
            { label: "Peak Month", value: `${registrationsSummary.peakPoint.label} • ${registrationsSummary.peakPoint.value}` },
            { label: "Average", value: `${registrationsSummary.average} students` },
            { label: "Momentum", value: `${registrationsSummary.momentum >= 0 ? "+" : ""}${registrationsSummary.momentum}% this cycle` },
          ]}
        />

        <StatsBreakdownCard
          title="Club Categories"
          subtitle="Share of active clubs by program focus."
          items={clubBreakdown}
          footerNote={`${clubBreakdown.length} tracked categories.`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-3">
          <VenueOccupancyTrends
            points={occupancyPoints}
            title="Venue Occupancy"
            subtitle="Weekly peak utilization trends"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Most popular venue</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">{venueKpis.mostPopular || "-"}</p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">Average session</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">{venueKpis.avgSessionHours ?? "-"} Hours</p>
            </article>
          </div>
        </div>

        <StatsBreakdownCard
          title="Event Distribution"
          subtitle="Categorical split of planned activities."
          items={eventDistribution}
          showDonut
          donutLabel="Events"
          footerNote={`${eventDistribution.reduce((sum, item) => sum + item.value, 0)} events recorded in the selected period.`}
          className="min-w-0"
        />
      </div>
    </div>
  );
}
