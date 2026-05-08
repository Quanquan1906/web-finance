import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '../api/budgetApi';
import { budgetQueryKeys } from './query-keys';
import type { CreateBudgetInput, UpdateBudgetInput } from './types';

export function useBudgetsQuery(params?: { year?: number; month?: number }) {
  return useQuery({
    queryKey: budgetQueryKeys.list(params),
    queryFn: () => budgetApi.getBudgets(params),
  });
}

export function useBudgetProgressQuery(year: number, month: number) {
  return useQuery({
    queryKey: budgetQueryKeys.progress(year, month),
    queryFn: () => budgetApi.getBudgetProgress(year, month),
  });
}

export function useCreateBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudgetInput) => budgetApi.createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.all });
    },
  });
}

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBudgetInput }) =>
      budgetApi.updateBudget(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.all });
    },
  });
}

export function useDeleteBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetApi.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.all });
    },
  });
}
