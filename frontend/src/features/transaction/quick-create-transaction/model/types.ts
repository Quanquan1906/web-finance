export interface QuickTransactionSuggestion {
  type: "income" | "expense";
  amount: string;
  transaction_date: string;
  note: string;
  suggested_category_name?: string | null;
  category_id?: string | null;
}

export interface QuickTransactionParseRequest {
  text: string;
}

/** Quick OCR preview returned by POST /ocr/receipt-preview.  NOT auto-saved. */
export interface ReceiptOcrParseResponse {
  transaction_type: "income" | "expense" | null;
  amount: number | null;
  category_suggestion:
    | "food"
    | "shopping"
    | "transport"
    | "health"
    | "entertainment"
    | "bill"
    | "education"
    | "other"
    | null;
}
