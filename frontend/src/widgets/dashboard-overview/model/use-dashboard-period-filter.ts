import { useState } from 'react';
import type { DashboardFilters, DashboardPeriod } from '@/entities/dashboard';
import { getPeriodLabel } from '../lib/get-period-label';

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface DashboardPeriodFilterState {
  period: DashboardPeriod;
  selectedDate: string;
  selectedMonth: number;
  selectedYear: number;
  currentYear: number;
  setPeriod: (p: DashboardPeriod) => void;
  setSelectedDate: (d: string) => void;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
  dashboardFilters: DashboardFilters;
  periodLabel: string;
}

export function useDashboardPeriodFilter(): DashboardPeriodFilterState {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [period, setPeriod] = useState<DashboardPeriod>('month');
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(today));
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const dashboardFilters: DashboardFilters =
    period === 'day'
      ? { period: 'day', date: selectedDate }
      : period === 'month'
        ? { period: 'month', month: selectedMonth, year: selectedYear }
        : { period: 'year', year: selectedYear };

  return {
    period,
    selectedDate,
    selectedMonth,
    selectedYear,
    currentYear,
    setPeriod,
    setSelectedDate,
    setSelectedMonth,
    setSelectedYear,
    dashboardFilters,
    periodLabel: getPeriodLabel(period),
  };
}
