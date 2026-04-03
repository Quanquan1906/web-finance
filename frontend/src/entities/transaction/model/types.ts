export type TransactionType = "income" | "expense";
export type TransactionSource = "manual" | "nlp" | "ocr";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string | null;
  source: TransactionSource;
  created_at: string;
  updated_at: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
}

export interface CreateTransactionInput {
  category_id: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
  source?: TransactionSource;
}

export interface UpdateTransactionInput {
  category_id?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
  note?: string;
  source?: TransactionSource;
}