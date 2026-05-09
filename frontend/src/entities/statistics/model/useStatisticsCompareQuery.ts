import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../api/statisticsApi';
import { statisticsQueryKeys } from './query-keys';
import type { StatisticsCompareFilters } from './types';

export function useStatisticsCompareQuery(filters: StatisticsCompareFilters) {
  return useQuery({
    queryKey: statisticsQueryKeys.compare(filters),
    queryFn: () => statisticsApi.compare(filters),
  });
}
