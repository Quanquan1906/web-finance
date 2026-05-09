import { apiClient } from '@/shared/api';
import type { DashboardFilters, DashboardOverview } from '../model/types';

export const dashboardApi = {
  async getOverview(filters: DashboardFilters): Promise<DashboardOverview> {
    const params: Record<string, string> = {
      period: filters.period,
    };

    if (filters.period === 'day') {
      params.date = filters.date;
    }

    if (filters.period === 'month') {
      params.month = String(filters.month);
      params.year = String(filters.year);
    }

    if (filters.period === 'year') {
      params.year = String(filters.year);
    }

    const { data } = await apiClient.get<DashboardOverview>(
      '/dashboard/overview',
      { params },
    );

    return data;
  },
};