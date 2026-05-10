import { apiClient } from "@/shared/api";
import type {
  QuickTransactionParseRequest,
  QuickTransactionSuggestion,
  ReceiptOcrParseResponse,
} from "../model/types";

export const quickTransactionApi = {
  parse: async (payload: QuickTransactionParseRequest): Promise<QuickTransactionSuggestion> => {
    const { data } = await apiClient.post<QuickTransactionSuggestion>(
      "/transactions/quick-parse",
      payload
    );
    return data;
  },

  parseReceiptImage: async (file: File): Promise<ReceiptOcrParseResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    // Remove Content-Type so axios can set multipart/form-data with the
    // correct boundary (the default JSON header breaks multipart parsing).
    const { data } = await apiClient.post<ReceiptOcrParseResponse>(
      "/ocr/receipt-preview",
      formData,
      {
        headers: { "Content-Type": undefined },
        // Gemini API call — give it up to 60 s.
        timeout: 60_000,
      }
    );
    return data;
  },
};
