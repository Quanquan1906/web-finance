import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { useCategoriesQuery, type Category } from '@/entities/category';
import { CreateCategoryDialog } from '@/features/category/create-category';
import { EditCategoryDialog } from '@/features/category/edit-category';
import { DeleteCategoryDialog } from '@/features/category/delete-category';
import { CategoriesGrid } from '@/widgets/categories-grid';

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
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Danh mục</h1>
          <p className="text-sm text-muted-foreground">Phân loại các khoản thu chi của bạn</p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Thêm danh mục
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Không thể tải danh mục. Vui lòng thử lại.
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Chưa có danh mục nào</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tạo danh mục đầu tiên để bắt đầu phân loại giao dịch
            </p>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="mt-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Thêm danh mục đầu tiên
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
