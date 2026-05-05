import { apiClient } from "@/shared/api";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionListResponse,
  UpdateTransactionInput,
} from "../model/types";

export const transactionApi = {
  getTransactions: async () => {
    const { data } = await apiClient.get<TransactionListResponse>("/transactions");
    return data;
  },

  createTransaction: async (payload: CreateTransactionInput) => {
    const { data } = await apiClient.post<Transaction>("/transactions", payload);
    return data;
  },

  updateTransaction: async (id: string, payload: UpdateTransactionInput) => {
    const { data } = await apiClient.patch<Transaction>(`/transactions/${id}`, payload);
    return data;
  },

  deleteTransaction: async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/transactions/${id}`);
    return data;
  },
};
