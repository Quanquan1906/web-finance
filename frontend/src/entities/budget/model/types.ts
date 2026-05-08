// Decimal fields from BE serialize as strings in JSON

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  year: number;
  month: number;
  amount_limit: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetProgressItem {
  budget_id: string;
  category_id: string;
  category_name: string;
  year: number;
  month: number;
  amount_limit: string;
  spent: string;
  remaining: string;
  percentage_used: string;
  is_over_budget: boolean;
}

export interface CreateBudgetInput {
  category_id: string;
  year: number;
  month: number;
  amount_limit: number;
}

export interface UpdateBudgetInput {
  category_id?: string;
  year?: number;
  month?: number;
  amount_limit?: number;
}
