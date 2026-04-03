import { apiClient } from "@/shared/api";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionListResponse,
  UpdateTransactionInput,
} from "../model/types";

export const transactionApi = {
  getTransactions: async () => {
    const { data } = await apiClient.get<TransactionListResponse>("api/v1/transactions");
    return data;
  },

  createTransaction: async (payload: CreateTransactionInput) => {
    const { data } = await apiClient.post<Transaction>("api/v1/transactions", payload);
    return data;
  },

  updateTransaction: async (id: string, payload: UpdateTransactionInput) => {
    const { data } = await apiClient.patch<Transaction>(`api/v1/transactions/${id}`, payload);
    return data;
  },

  deleteTransaction: async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`api/v1/transactions/${id}`);
    return data;
  },
};