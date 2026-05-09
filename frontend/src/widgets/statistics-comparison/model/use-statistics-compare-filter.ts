import { useState } from 'react';
import type { StatisticsCompareFilters } from '@/entities/statistics';
import { getPreviousMonth } from '../lib/get-previous-month';

export function getDefaultFilters(): StatisticsCompareFilters {
  const now = new Date();
  const current_month = now.getMonth() + 1;
  const current_year = now.getFullYear();
  const prev = getPreviousMonth(current_month, current_year);
  return {
    period: 'month',
    current_month,
    current_year,
    compare_month: prev.month,
    compare_year: prev.year,
  };
}

export function useStatisticsCompareFilter() {
  const [filters, setFilters] = useState<StatisticsCompareFilters>(getDefaultFilters);

  return {
    filters,
    setCurrentMonth: (m: number) => setFilters((f) => ({ ...f, current_month: m })),
    setCurrentYear: (y: number) => setFilters((f) => ({ ...f, current_year: y })),
    setCompareMonth: (m: number) => setFilters((f) => ({ ...f, compare_month: m })),
    setCompareYear: (y: number) => setFilters((f) => ({ ...f, compare_year: y })),
  };
}
