import type { AxiosError } from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { toast } from "@/shared/lib/toast";

import { useDeleteCategoryMutation } from "../model/useDeleteCategoryMutation";

interface DeleteCategoryDialogProps {
  open: boolean;
  categoryId: string | null;
  categoryName?: string;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  open,
  categoryId,
  categoryName,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleConfirmDelete = async () => {
    if (!categoryId) return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      const message =
        axiosErr.response?.data?.detail ??
        "Không thể xóa danh mục. Vui lòng thử lại.";
      toast.error(message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa danh mục</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa danh mục
            {categoryName ? ` "${categoryName}"` : ""} không?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={deleteCategoryMutation.isPending}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}