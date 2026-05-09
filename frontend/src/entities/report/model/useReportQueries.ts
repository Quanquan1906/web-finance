import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../api/reportApi';
import { reportQueryKeys } from './query-keys';
import type { ReportFilters } from './types';

export function useReportSummaryQuery(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportQueryKeys.summary(filters),
    queryFn: () => reportApi.getSummary(filters),
  });
}

export function useExpenseByCategoryQuery(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: reportQueryKeys.expenseByCategory(filters),
    queryFn: () => reportApi.getExpenseByCategory(filters),
  });
}
