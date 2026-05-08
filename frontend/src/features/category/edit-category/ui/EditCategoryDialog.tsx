import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import {
  CategoryForm,
  DEFAULT_CATEGORY_FORM_VALUES,
  type Category,
  type CategoryFormValues,
} from "@/entities/category";
import { useEditCategoryMutation } from "../model/useEditCategoryMutation";

interface EditCategoryDialogProps {
  open: boolean;
  category: Category | null;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  open,
  category,
  onOpenChange,
}: EditCategoryDialogProps) {
  const editCategoryMutation = useEditCategoryMutation();

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!category) return;

    // CategoryUpdate only accepts name; kind is immutable
    await editCategoryMutation.mutateAsync({
      categoryId: category.id,
      payload: { name: values.name },
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
        </DialogHeader>

        <CategoryForm
          initialValues={{
            name: category?.name ?? DEFAULT_CATEGORY_FORM_VALUES.name,
            kind: category?.kind ?? DEFAULT_CATEGORY_FORM_VALUES.kind,
          }}
          hideKind
          submitLabel="Lưu thay đổi"
          isSubmitting={editCategoryMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}