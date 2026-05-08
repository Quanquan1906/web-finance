import type { AxiosError } from 'axios';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { toast } from '@/shared/lib/toast';
import { useDeleteBudgetMutation } from '@/entities/budget';

interface DeleteBudgetDialogProps {
  open: boolean;
  budgetId: string | null;
  label?: string; // e.g. "Ăn uống – Tháng 5/2025"
  onOpenChange: (open: boolean) => void;
}

export function DeleteBudgetDialog({
  open,
  budgetId,
  label,
  onOpenChange,
}: DeleteBudgetDialogProps) {
  const { mutateAsync, isPending } = useDeleteBudgetMutation();

  const handleConfirm = async () => {
    if (!budgetId) return;
    try {
      await mutateAsync(budgetId);
      toast.success('Đã xóa ngân sách');
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      const msg =
        axiosErr.response?.data?.detail ?? 'Không thể xóa ngân sách. Vui lòng thử lại.';
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa ngân sách</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa ngân sách{label ? ` "${label}"` : ''} không? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
