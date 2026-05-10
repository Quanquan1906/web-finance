import { useMutation } from "@tanstack/react-query";
import { quickTransactionApi } from "../api/quickTransactionApi";

export function useQuickParseTransaction() {
  return useMutation({
    mutationFn: (text: string) => quickTransactionApi.parse({ text }),
  });
}
