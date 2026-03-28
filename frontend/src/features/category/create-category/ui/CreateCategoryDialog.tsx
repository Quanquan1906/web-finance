import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import {
  CategoryForm,
  type CategoryFormValues,
} from "@/entities/category";
import { useCreateCategoryMutation } from "../model/useCreateCategoryMutation";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const createCategoryMutation = useCreateCategoryMutation();

  const handleSubmit = async (values: CategoryFormValues) => {
    await createCategoryMutation.mutateAsync(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Thêm danh mục</DialogTitle>
        </DialogHeader>

        <CategoryForm
          submitLabel="Tạo danh mục"
          isSubmitting={createCategoryMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}