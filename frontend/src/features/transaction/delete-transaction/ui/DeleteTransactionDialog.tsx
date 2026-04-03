import { Transaction } from '@/entities/transaction';
import { useState } from 'react';
import { useDeleteTransaction } from '../model/useDeleteTransaction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/ui/alert-dialog';

interface DeleteTranssactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  transaction
}: DeleteTranssactionDialogProps) {
  const { mutateAsync, isPending } = useDeleteTransaction();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      setSubmitError(null);
      await mutateAsync(transaction.id);
      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(error?.response?.data?.detail || 'Không thể xoá giao dịch.');
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa giao dịch?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa giao dịch
            {transaction?.note ? ` "${transaction.note}"` : ''} không? Hành động này không thể hoàn
            tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? 'Đang xoá...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
