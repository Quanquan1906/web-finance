import { BudgetProgressItem } from '@/entities/budget';
export type DashboardPeriod = 'day' | 'month' | 'year';

export type DashboardFilters =
  | {
      period: 'day';
      date: string; // YYYY-MM-DD
    }
  | {
      period: 'month';
      month: number; // 1 - 12
      year: number;
    }
  | {
      period: 'year';
      year: number;
    };

// Decimal fields from BE serialize as strings in JSON
export interface DashboardSummary {
  total_income: string;
  total_expense: string;
  period_balance: string;
}

export interface ExpenseByCategoryItem {
  category_id: string;
  category_name: string;
  total: string;
}

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
