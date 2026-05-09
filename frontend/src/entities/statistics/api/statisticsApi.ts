import { apiClient } from '@/shared/api';
import type { StatisticsCompareFilters, StatisticsCompareResponse } from '../model/types';

export const statisticsApi = {
  async compare(filters: StatisticsCompareFilters): Promise<StatisticsCompareResponse> {
    const { data } = await apiClient.get<StatisticsCompareResponse>(
      '/statistics/compare',
      { params: filters },
    );
    return data;
  },
};
