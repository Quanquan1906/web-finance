import { useUpdateTransactionMutation } from '@/entities/transaction';

export function useEditTransaction() {
    return useUpdateTransactionMutation();
}