import { apiClient } from "@/shared/api";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  UpdateTransactionInput,
} from "../model/types";

export const transactionApi = {
  getTransactions: async (params?: TransactionListParams) => {
    const { data } = await apiClient.get<TransactionListResponse>("/transactions", { params });
    return data;
  },

  getTransaction: async (id: string) => {
    const { data } = await apiClient.get<Transaction>(`/transactions/${id}`);
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

  deleteTransaction: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};
