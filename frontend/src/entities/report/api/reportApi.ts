import { apiClient } from '@/shared/api';
import type { CategoryBreakdownItem, ReportFilters, ReportSummary } from '../model/types';

function buildParams(filters: ReportFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.date_from) params.date_from = filters.date_from;
  if (filters.date_to) params.date_to = filters.date_to;
  if (filters.type) params.type = filters.type;
  return params;
}

export const reportApi = {
  async getSummary(filters: ReportFilters = {}): Promise<ReportSummary> {
    const { data } = await apiClient.get<ReportSummary>('/reports/summary', {
      params: buildParams(filters),
    });
    return data;
  },

  async getExpenseByCategory(filters: ReportFilters = {}): Promise<CategoryBreakdownItem[]> {
    const { data } = await apiClient.get<CategoryBreakdownItem[]>('/reports/by-category', {
      params: buildParams(filters),
    });
    return data;
  },
};
