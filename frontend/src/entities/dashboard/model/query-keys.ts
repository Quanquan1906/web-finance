import type { DashboardFilters } from './types';

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  overview: (filters: DashboardFilters) =>
    [...dashboardQueryKeys.all, 'overview', filters] as const,
};
