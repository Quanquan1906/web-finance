import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
        'group flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg text-white shadow-sm',
            category.color
          )}
        >
          <span>{category.icon}</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.transactionCount} giao dịch</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => onEdit(category.id)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 size-3.5" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(category.id)}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="mr-2 size-3.5" />
            Xóa danh mục
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
