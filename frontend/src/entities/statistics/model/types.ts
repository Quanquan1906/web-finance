export type StatisticsPeriod = 'month';

export interface StatisticsCompareFilters {
  period: StatisticsPeriod;
  current_month: number;
  current_year: number;
  compare_month: number;
  compare_year: number;
}

// Decimal fields from BE serialize as strings in JSON
export interface StatisticsPeriodSummary {
  label: string;
  total_income: string;
  total_expense: string;
  period_balance: string;
}

export interface StatisticsDifference {
  income_diff: string;
  expense_diff: string;
  balance_diff: string;
  income_percent: number | null;
  expense_percent: number | null;
  balance_percent: number | null;
}

export interface CategoryComparisonItem {
  category_id: string;
  category_name: string;
  current_total: string;
  compare_total: string;
  diff: string;
  percent: number | null;
}

export interface StatisticsCompareResponse {
  period: StatisticsPeriod;
  current: StatisticsPeriodSummary;
  compare: StatisticsPeriodSummary;
  difference: StatisticsDifference;
  category_comparison: CategoryComparisonItem[];
}
