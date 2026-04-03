import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../api/transactionApi';

export const transactionQueryKeys = {
  all: ['transactions'] as const
};

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionQueryKeys.all,
    queryFn: transactionApi.getTransactions
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    }
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string;
      payload: Parameters<typeof transactionApi.updateTransaction>[1];
    }) => transactionApi.updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    }
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionApi.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    }
  });
}
