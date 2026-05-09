import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";
import { dashboardQueryKeys } from "./query-keys";
import type { DashboardFilters } from "./types";

export function useDashboardQuery(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(filters),
    queryFn: () => dashboardApi.getOverview(filters),
    enabled: isValidDashboardFilters(filters),
  });
}

function isValidDashboardFilters(filters: DashboardFilters) {
  if (filters.period === "day") {
    return Boolean(filters.date);
  }

  if (filters.period === "month") {
    return Boolean(filters.month && filters.year);
  }

  if (filters.period === "year") {
    return Boolean(filters.year);
  }

  return false;
}