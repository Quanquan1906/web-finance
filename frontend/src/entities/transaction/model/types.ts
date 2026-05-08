export type TransactionType = "income" | "expense";

// amount is Decimal on BE, serializes as string in JSON
export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: string;
  type: TransactionType;
  transaction_date: string;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

export interface TransactionListParams {
  date_from?: string;
  date_to?: string;
  type?: TransactionType;
  limit?: number;
  offset?: number;
  sort_by?: 'transaction_date' | 'amount' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface CreateTransactionInput {
  category_id: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  note?: string;
}

export interface UpdateTransactionInput {
  category_id?: string;
  amount?: number;
  type?: TransactionType;
  transaction_date?: string;
  note?: string;
}