export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  type?: 'income' | 'expense';
}

// Decimal fields from BE serialize as strings in JSON.
export interface ReportSummary {
  total_income: string;
  total_expense: string;
  balance: string;
}

export interface CategoryBreakdownItem {
  category_id: string;
  category_name: string;
  total: string;
}

export type ReportPeriod = 'all' | 'week' | 'month' | 'year';
