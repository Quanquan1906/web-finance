import { useCreateTransactionMutation } from "@/entities/transaction";

export function useCreateTransaction() {
  return useCreateTransactionMutation();
}