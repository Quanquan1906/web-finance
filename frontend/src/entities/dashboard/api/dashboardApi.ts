import { apiClient } from '@/shared/api';
import type { DashboardFilters, DashboardOverview } from '../model/types';

export const dashboardApi = {
  async getOverview(filters: DashboardFilters = {}): Promise<DashboardOverview> {
    const params: Record<string, string> = {};
    if (filters.preset) params.preset = filters.preset;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;

    const { data } = await apiClient.get<DashboardOverview>('/dashboard/overview', { params });
    return data;
  },
};
