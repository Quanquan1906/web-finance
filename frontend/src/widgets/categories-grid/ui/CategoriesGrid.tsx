import { CategoryCard, toCategoryCardViewModel, type Category } from "@/entities/category";

interface CategoriesGridProps {
  categories: Category[];
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoriesGrid({
  categories,
  onEdit,
  onDelete,
}: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={toCategoryCardViewModel(category, 0)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}