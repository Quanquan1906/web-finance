import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { dashboardQueryKeys } from './query-keys';
import type { DashboardFilters } from './types';

export function useDashboardQuery(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(filters),
    queryFn: () => dashboardApi.getOverview(filters),
  });
}
