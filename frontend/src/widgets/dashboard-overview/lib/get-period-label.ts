import type { DashboardPeriod } from '@/entities/dashboard';

export function getPeriodLabel(period: DashboardPeriod): string {
  if (period === 'day') return 'trong ngày';
  if (period === 'month') return 'trong tháng';
  return 'trong năm';
}
