import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { useCreateTransaction } from "../model/use-create-transaction";
import type { TransactionFormValues } from "../model/schema";

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
}: CreateTransactionDialogProps) {
  const { mutateAsync, isPending } = useCreateTransaction();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      setSubmitError(null);

      await mutateAsync({
        ...values,
        amount: Number(values.amount),
      });

      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.detail || "Không thể tạo giao dịch."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Thêm giao dịch
          </DialogTitle>
        </DialogHeader>

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        ) : null}

        <TransactionForm
          isSubmitting={isPending}
          submitText="Lưu giao dịch"
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}