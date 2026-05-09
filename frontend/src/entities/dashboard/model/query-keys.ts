import type { DashboardFilters } from './types';

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,

  overview: (filters: DashboardFilters) => {
    if (filters.period === 'day') {
      return [
        ...dashboardQueryKeys.all,
        'overview',
        filters.period,
        filters.date,
      ] as const;
    }

    if (filters.period === 'month') {
      return [
        ...dashboardQueryKeys.all,
        'overview',
        filters.period,
        filters.month,
        filters.year,
      ] as const;
    }

    return [
      ...dashboardQueryKeys.all,
      'overview',
      filters.period,
      filters.year,
    ] as const;
  },
};