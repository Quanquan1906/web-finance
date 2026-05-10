import { useMutation } from "@tanstack/react-query";
import { quickTransactionApi } from "../api/quickTransactionApi";

export function useReceiptOcrParseMutation() {
  return useMutation({
    mutationFn: (file: File) => quickTransactionApi.parseReceiptImage(file),
  });
}
