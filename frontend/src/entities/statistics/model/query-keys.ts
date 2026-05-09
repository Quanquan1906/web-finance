import type { StatisticsCompareFilters } from './types';

export const statisticsQueryKeys = {
  all: ['statistics'] as const,
  compare: (filters: StatisticsCompareFilters) =>
    [
      'statistics',
      'compare',
      filters.period,
      filters.current_month,
      filters.current_year,
      filters.compare_month,
      filters.compare_year,
    ] as const,
};
