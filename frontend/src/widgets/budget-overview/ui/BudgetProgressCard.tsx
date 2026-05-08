import { Pencil, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

import { Progress } from '@/shared/ui/progress';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { BudgetProgressItem, Budget } from '@/entities/budget';

interface BudgetProgressCardProps {
  item: BudgetProgressItem;
  budget?: Budget; // needed for edit/delete
  onEdit?: (budget: Budget) => void;
  onDelete?: (budgetId: string, label: string) => void;
}

export function BudgetProgressCard({
  item,
  budget,
  onEdit,
  onDelete,
}: BudgetProgressCardProps) {
  const pct = Math.min(parseFloat(item.percentage_used), 100);
  const isOver = item.is_over_budget;
  const remaining = parseFloat(item.remaining);
  const spent = parseFloat(item.spent);
  const limit = parseFloat(item.amount_limit);

  const MONTH_NAMES = [
    '', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];
  const label = `${item.category_name} – ${MONTH_NAMES[item.month]}/${item.year}`;

  return (
    <div
      className={cn(
        'rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        isOver ? 'border-destructive/40 bg-destructive/5' : 'border-border',
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isOver ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          )}
          <span
            className={cn(
              'truncate text-sm font-semibold',
              isOver ? 'text-destructive' : 'text-foreground',
            )}
          >
            {item.category_name}
          </span>
        </div>

        <div className="flex shrink-0 gap-1">
          {budget && onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(budget)}
              aria-label="Chỉnh sửa"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {budget && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(budget.id, label)}
              aria-label="Xóa"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Period */}
      <p className="mt-0.5 text-xs text-muted-foreground">
        {MONTH_NAMES[item.month]}/{item.year}
      </p>

      {/* Progress bar */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-end justify-between text-xs">
          <span className="text-muted-foreground">
            Đã dùng: <span className="font-medium text-foreground">{formatCurrency(spent)}</span>
          </span>
          <span className="text-muted-foreground">
            Giới hạn: <span className="font-medium text-foreground">{formatCurrency(limit)}</span>
          </span>
        </div>

        <Progress
          value={pct}
          className={cn(
            'h-2',
            isOver ? '[&>div]:bg-destructive' : '[&>div]:bg-emerald-500',
          )}
        />

        <div className="flex items-center justify-between text-xs">
          <span
            className={cn(
              'font-medium',
              isOver ? 'text-destructive' : 'text-emerald-600',
            )}
          >
            {isOver ? (
              <>Đã vượt {formatCurrency(Math.abs(remaining))}</>
            ) : (
              <>Còn lại: {formatCurrency(remaining)}</>
            )}
          </span>
          <span
            className={cn(
              'font-semibold',
              isOver ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {parseFloat(item.percentage_used).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Over budget badge */}
      {isOver && (
        <div className="mt-3 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive">
          ⚠ Đã vượt ngân sách – chi tiêu vượt{' '}
          {formatCurrency(Math.abs(remaining))}
        </div>
      )}
    </div>
  );
}
