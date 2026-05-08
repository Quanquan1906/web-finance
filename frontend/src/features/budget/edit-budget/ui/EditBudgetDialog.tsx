import { useState } from 'react';
import type { AxiosError } from 'axios';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { toast } from '@/shared/lib/toast';
import { useUpdateBudgetMutation } from '@/entities/budget';
import type { Budget } from '@/entities/budget';

import { BudgetForm } from '@/features/budget/create-budget';
import type { BudgetFormValues } from '@/features/budget/create-budget';

interface EditBudgetDialogProps {
  open: boolean;
  budget: Budget | null;
  onOpenChange: (open: boolean) => void;
}

export function EditBudgetDialog({ open, budget, onOpenChange }: EditBudgetDialogProps) {
  const { mutateAsync, isPending } = useUpdateBudgetMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: BudgetFormValues) => {
    if (!budget) return;
    try {
      setSubmitError(null);
      await mutateAsync({
        id: budget.id,
        payload: {
          category_id: values.category_id,
          year: Number(values.year),
          month: Number(values.month),
          amount_limit: Number(values.amount_limit),
        },
      });
      toast.success('Đã cập nhật ngân sách');
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      const msg =
        axiosErr.response?.data?.detail ?? 'Không thể cập nhật ngân sách. Vui lòng thử lại.';
      setSubmitError(msg);
    }
  };

  const initialValues: Partial<BudgetFormValues> | undefined = budget
    ? {
        category_id: budget.category_id,
        year: String(budget.year),
        month: String(budget.month),
        amount_limit: String(parseFloat(budget.amount_limit)),
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Chỉnh sửa ngân sách</DialogTitle>
        </DialogHeader>

        {submitError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {submitError}
          </div>
        )}

        <BudgetForm
          initialValues={initialValues}
          isSubmitting={isPending}
          submitLabel="Lưu thay đổi"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
