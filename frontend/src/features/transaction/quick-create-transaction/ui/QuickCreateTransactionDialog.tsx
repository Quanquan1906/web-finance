import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";
import {
  TransactionForm,
  useCreateTransaction,
  type TransactionFormValues,
} from "@/features/transaction/create-transaction";

import { useQuickParseTransaction } from "../model/use-quick-parse-transaction";
import { useReceiptOcrParseMutation } from "../model/use-receipt-ocr-parse";
import type { QuickTransactionSuggestion, ReceiptOcrParseResponse } from "../model/types";
import { ReceiptUploadStep } from "./ReceiptUploadStep";

interface QuickCreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "text" | "receipt";
type Step = "input" | "review";

export function QuickCreateTransactionDialog({
  open,
  onOpenChange,
}: QuickCreateTransactionDialogProps) {
  const [tab, setTab] = useState<Tab>("text");
  const [step, setStep] = useState<Step>("input");

  // text tab state
  const [text, setText] = useState("");
  const [textError, setTextError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // receipt tab state
  const [ocrError, setOcrError] = useState<string | null>(null);

  // shared
  const [suggestion, setSuggestion] = useState<QuickTransactionSuggestion | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categoryHint, setCategoryHint] = useState<string | null>(null);

  const { mutateAsync: parse, isPending: isParsing } = useQuickParseTransaction();
  const { mutateAsync: parseReceipt, isPending: isOcrParsing } = useReceiptOcrParseMutation();
  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction();

  function resetAll() {
    setTab("text");
    setStep("input");
    setText("");
    setTextError(null);
    setParseError(null);
    setOcrError(null);
    setSuggestion(null);
    setSubmitError(null);
    setCategoryHint(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetAll();
    onOpenChange(nextOpen);
  }

  // ── Text tab ──────────────────────────────────────────────────────────────

  async function handleParse() {
    setTextError(null);
    setParseError(null);

    if (!text.trim()) {
      setTextError("Vui lòng nhập nội dung giao dịch.");
      return;
    }

    try {
      const result = await parse(text.trim());
      setSuggestion(result);
      setStep("review");
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ??
        "Không thể phân tích nội dung. Hãy nhập rõ số tiền, ví dụ: \"ăn buffet 500000 hôm nay\".";
      setParseError(detail);
    }
  }

  // ── Receipt tab ───────────────────────────────────────────────────────────

  async function handleOcrParse(file: File) {
    setOcrError(null);
    try {
      const result: ReceiptOcrParseResponse = await parseReceipt(file);
      // Map 3-field OCR preview → QuickTransactionSuggestion for the shared form
      setSuggestion({
        type: result.transaction_type ?? "expense",
        amount: String(result.amount ?? ""),
        transaction_date: new Date().toISOString().split("T")[0],
        note: "",
        suggested_category_name: result.category_suggestion ?? null,
        category_id: null,
        confidence: 1,
      });
      setCategoryHint(result.category_suggestion);
      setStep("review");
    } catch (error: any) {
      const raw = error?.response?.data?.detail;
      const detail =
        typeof raw === "string"
          ? raw
          : Array.isArray(raw) && raw.length > 0
          ? (raw as Array<{ msg?: string }>)
              .map((e) => e.msg ?? JSON.stringify(e))
              .join("; ")
          : "Không đọc được hóa đơn. Vui lòng thử ảnh rõ hơn hoặc nhập bằng text.";
      setOcrError(detail);
    }
  }

  // ── Create transaction ────────────────────────────────────────────────────

  async function handleCreate(values: TransactionFormValues) {
    try {
      setSubmitError(null);
      await createTransaction({
        ...values,
        amount: Number(values.amount),
      });
      handleOpenChange(false);
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.detail ?? "Không thể tạo giao dịch."
      );
    }
  }

  const defaultValues = suggestion
    ? {
        type: suggestion.type,
        amount: String(suggestion.amount),
        category_id: suggestion.category_id ?? "",
        transaction_date: suggestion.transaction_date,
        note: suggestion.note,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "input" ? "Nhập nhanh giao dịch" : "Xác nhận giao dịch"}
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <>
            {/* Tab switcher */}
            <div className="flex rounded-xl bg-muted p-1 gap-1">
              <button
                type="button"
                onClick={() => { setTab("text"); setParseError(null); setOcrError(null); }}
                className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                  tab === "text"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Nhập text
              </button>
              <button
                type="button"
                onClick={() => { setTab("receipt"); setParseError(null); setOcrError(null); }}
                className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                  tab === "receipt"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upload hóa đơn
              </button>
            </div>

            {/* Tab: Text */}
            {tab === "text" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Textarea
                    placeholder={`Ví dụ: ăn buffet 500000 hôm nay\nmua áo 300000 ngày 9/5/2026\nlương công ty 5000000 hôm nay`}
                    className="min-h-28 rounded-xl"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (textError) setTextError(null);
                    }}
                    disabled={isParsing}
                  />
                  {textError && (
                    <p className="text-sm text-destructive">{textError}</p>
                  )}
                </div>

                {parseError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {parseError}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    disabled={isParsing}
                    className="h-10 rounded-xl px-5"
                    onClick={handleParse}
                  >
                    {isParsing ? "Đang phân tích..." : "Phân tích"}
                  </Button>
                </div>
              </div>
            )}

            {/* Tab: Receipt upload */}
            {tab === "receipt" && (
              <ReceiptUploadStep
                isParsing={isOcrParsing}
                ocrError={ocrError}
                onParse={handleOcrParse}
              />
            )}
          </>
        )}

        {step === "review" && suggestion && (
          <div className="space-y-4">
            {categoryHint && !suggestion.category_id && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                Danh mục gợi ý: <span className="font-medium">{categoryHint}</span>
                {" "}— vui lòng chọn danh mục phù hợp bên dưới.
              </div>
            )}

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <TransactionForm
              defaultValues={defaultValues}
              isSubmitting={isCreating}
              submitText="Tạo giao dịch"
              onSubmit={handleCreate}
            />

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl text-sm text-muted-foreground"
              onClick={() => {
                setStep("input");
                setSubmitError(null);
              }}
            >
              ← Nhập lại
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
