export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
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