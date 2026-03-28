import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { useCategoriesQuery, type Category } from '@/entities/category';
import { CreateCategoryDialog } from '@/features/category/create-category';
import { EditCategoryDialog } from '@/features/category/edit-category';
import { DeleteCategoryDialog } from '@/features/category/delete-category';
import { CategoriesGrid } from '@/widgets/categories-grid';
import { Label } from '@/shared/ui/label';

export function CategoriesPage() {
  const { data: categories = [], isLoading, isError } = useCategoriesQuery();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const editingCategory = useMemo<Category | null>(() => {
    return categories.find((item) => item.id === editingCategoryId) ?? null;
  }, [categories, editingCategoryId]);

  const deletingCategory = useMemo<Category | null>(() => {
    return categories.find((item) => item.id === deletingCategoryId) ?? null;
  }, [categories, deletingCategoryId]);

  const handleOpenCreate = () => {
    setCreateOpen(true);
  };

  const handleOpenEdit = (categoryId: string) => {
    setEditingCategoryId(categoryId);
  };

  const handleCloseEdit = (open: boolean) => {
    if (!open) {
      setEditingCategoryId(null);
    }
  };

  const handleCloseDelete = (open: boolean) => {
    if (!open) {
      setDeletingCategoryId(null);
    }
  };

  const handleOpenDelete = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label className="text-3xl font-bold text-slate-900">Danh mục chi tiêu</Label>
          <p className="mt-1 text-sm text-slate-500">Phân loại các khoản thu chi của bạn</p>
        </div>

        <Button onClick={handleOpenCreate} className="h-11 rounded-xl px-5">
          <Plus className="mr-2 size-4" />
          Thêm danh mục
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
          Đang tải danh mục...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          Không thể tải danh mục. Vui lòng thử lại.
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-base font-medium text-slate-900">Bạn chưa có danh mục nào</p>
          <p className="mt-1 text-sm text-slate-500">
            Hãy tạo danh mục đầu tiên để bắt đầu quản lý giao dịch.
          </p>
          <Button onClick={handleOpenCreate} className="mt-4">
            Thêm danh mục
          </Button>
        </div>
      ) : (
        <CategoriesGrid
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <CreateCategoryDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditCategoryDialog
        open={Boolean(editingCategory)}
        category={editingCategory}
        onOpenChange={handleCloseEdit}
      />

      <DeleteCategoryDialog
        open={Boolean(deletingCategory)}
        categoryId={deletingCategory?.id ?? null}
        categoryName={deletingCategory?.name}
        onOpenChange={handleCloseDelete}
      />
    </div>
  );
}
