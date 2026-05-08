export type DashboardPreset = 'current_month' | 'current_year' | 'last_15_days';

export interface DashboardFilters {
  preset?: DashboardPreset;
  date_from?: string;
  date_to?: string;
}

// Decimal fields from BE serialize as strings in JSON
export interface DashboardSummary {
  total_income: string;
  total_expense: string;
  balance: string;
}

export interface ExpenseByCategoryItem {
  category_id: string;
  category_name: string;
  total: string;
}

// Re-exported from entities/budget to avoid duplication
export type { BudgetProgressItem } from '@/entities/budget';

export interface DashboardRecentTransaction {
  id: string;
  user_id: string;
  category_id: string;
  type: 'income' | 'expense';
  amount: string;
  note: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  expense_by_category: ExpenseByCategoryItem[];
  budget_progress: BudgetProgressItem[];
  recent_transactions: DashboardRecentTransaction[];
}
