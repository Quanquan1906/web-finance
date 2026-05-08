import { useState } from 'react';
import type { AxiosError } from 'axios';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { toast } from '@/shared/lib/toast';
import { useCreateBudgetMutation } from '@/entities/budget';

import { BudgetForm } from './BudgetForm';
import type { BudgetFormValues } from '../model/schema';

interface CreateBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBudgetDialog({ open, onOpenChange }: CreateBudgetDialogProps) {
  const { mutateAsync, isPending } = useCreateBudgetMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: BudgetFormValues) => {
    try {
      setSubmitError(null);
      await mutateAsync({
        category_id: values.category_id,
        year: Number(values.year),
        month: Number(values.month),
        amount_limit: Number(values.amount_limit),
      });
      toast.success('Đã thêm ngân sách thành công');
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      const msg =
        axiosErr.response?.data?.detail ?? 'Không thể tạo ngân sách. Vui lòng thử lại.';
      setSubmitError(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Thêm ngân sách</DialogTitle>
        </DialogHeader>

        {submitError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {submitError}
          </div>
        )}

        <BudgetForm
          isSubmitting={isPending}
          submitLabel="Thêm ngân sách"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
