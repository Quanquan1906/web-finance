import { apiClient } from '@/shared/api';
import type { Budget, CreateBudgetInput, UpdateBudgetInput, BudgetProgressItem } from '../model/types';

export const budgetApi = {
  async getBudgets(params?: { year?: number; month?: number }): Promise<Budget[]> {
    const { data } = await apiClient.get<Budget[]>('/budgets', { params });
    return data;
  },

  async createBudget(payload: CreateBudgetInput): Promise<Budget> {
    const { data } = await apiClient.post<Budget>('/budgets', payload);
    return data;
  },

  async updateBudget(id: string, payload: UpdateBudgetInput): Promise<Budget> {
    const { data } = await apiClient.patch<Budget>(`/budgets/${id}`, payload);
    return data;
  },

  async deleteBudget(id: string): Promise<void> {
    await apiClient.delete(`/budgets/${id}`);
  },

  async getBudgetProgress(year: number, month: number): Promise<BudgetProgressItem[]> {
    const { data } = await apiClient.get<BudgetProgressItem[]>('/budgets/progress', {
      params: { year, month },
    });
    return data;
  },
};
