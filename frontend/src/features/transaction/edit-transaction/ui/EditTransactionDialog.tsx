import { useMemo, useState } from 'react';

import type { Transaction } from '@/entities/transaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import type { TransactionFormValues } from '@/features/transaction/create-transaction';
import { TransactionForm } from '@/features/transaction/create-transaction';
import { useEditTransaction } from '../model/use-edit-transaction';

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

function normalizeDateInputValue(value?: string | null) {
  if (!value) return '';

  if (value.includes('T')) {
    return value.slice(0, 10);
  }

  return value;
}

function normalizeTransactionType(transaction: any): 'income' | 'expense' | '' {
  const rawType =
    transaction?.type ??
    transaction?.transaction_type ??
    transaction?.kind ??
    '';

  if (rawType === 'income' || rawType === 'expense') {
    return rawType;
  }

  return '';
}

function normalizeCategoryId(transaction: any): string {
  return (
    transaction?.category_id ??
    transaction?.category?.id ??
    transaction?.categoryId ??
    ''
  );
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
}: EditTransactionDialogProps) {
  const { mutateAsync, isPending } = useEditTransaction();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo(() => {
    if (!transaction) return undefined;

    const normalized = {
      category_id: normalizeCategoryId(transaction),
      amount: String(transaction.amount ?? ''),
      type: normalizeTransactionType(transaction),
      transaction_date: normalizeDateInputValue(transaction.transaction_date),
      note: transaction.note ?? '',
    };

    console.log('[EditTransactionDialog] transaction:', transaction);
    console.log('[EditTransactionDialog] defaultValues:', normalized);

    return normalized;
  }, [transaction]);

  const handleSubmit = async (values: TransactionFormValues) => {
    if (!transaction) return;

    try {
      setSubmitError(null);

      await mutateAsync({
        id: transaction.id,
        payload: {
          ...values,
          amount: Number(values.amount),
        },
      });

      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.detail || 'Không thể cập nhật giao dịch.',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chỉnh sửa giao dịch
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form chỉnh sửa giao dịch gồm loại giao dịch, số tiền, danh mục, ngày và ghi chú.
          </DialogDescription>
        </DialogHeader>

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        ) : null}

        {transaction && defaultValues ? (
          <TransactionForm
            key={`${transaction.id}-${defaultValues.type}-${defaultValues.category_id}`}
            defaultValues={defaultValues}
            isSubmitting={isPending}
            submitText="Cập nhật giao dịch"
            onSubmit={handleSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}