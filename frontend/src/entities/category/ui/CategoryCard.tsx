import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { CategoryCardViewModel } from '../model/type';

interface CategoryCardProps {
  category: CategoryCardViewModel;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  className?: string;
}

export function CategoryCard({ category, onEdit, onDelete, className }: CategoryCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl border bg-white px-4 py-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'grid size-12 place-items-center rounded-2xl text-xl text-white',
            category.color
          )}
        >
          <span>{category.icon}</span>
        </div>

        <div>
          <p className="text-base font-semibold text-slate-900">{category.name}</p>
          <p className="text-sm text-slate-500">{category.transactionCount} giao dịch</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-slate-500 hover:text-slate-900"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(category.id)}>
            <Pencil className="mr-2 size-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(category.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
