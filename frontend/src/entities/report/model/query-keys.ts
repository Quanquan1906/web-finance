import type { ReportFilters } from './types';

export const reportQueryKeys = {
  all: ['reports'] as const,
  summary: (filters: ReportFilters = {}) => [...reportQueryKeys.all, 'summary', filters] as const,
  expenseByCategory: (filters: ReportFilters = {}) =>
    [...reportQueryKeys.all, 'expense-by-category', filters] as const,
};
