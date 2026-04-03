import { useDeleteTransactionMutation } from "@/entities/transaction";

export function useDeleteTransaction() {
    return useDeleteTransactionMutation();
}