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

const KIND_LABEL: Record<string, string> = {
  income: 'Thu nhập',
  expense: 'Chi tiêu',
};

export function CategoryCard({ category, onEdit, onDelete, className }: CategoryCardProps) {
  const isIncome = category.kind === 'income';

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
            'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg shadow-sm',
            isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'
          )}
        >
          <span>{category.name.charAt(0).toUpperCase()}</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{category.name}</p>
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none',
                isIncome
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {KIND_LABEL[category.kind]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{category.transaction_count} giao dịch</p>
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
