import { useQuery } from "@tanstack/react-query";
import { getAnalyticsDashboard } from "@/api/services/analytics.service";

export function useAnalytics(period = "last-8-months") {
  return useQuery({
    queryKey: ["analytics", "dashboard", period],
    queryFn: () => getAnalyticsDashboard(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
  });
}
