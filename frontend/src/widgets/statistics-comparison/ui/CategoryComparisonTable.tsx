import { Progress } from '@/shared/ui/progress';
import { Skeleton } from '@/shared/ui/skeleton';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { CategoryComparisonItem } from '@/entities/statistics';
import { parseMoney } from '../lib/format-helpers';
import { DiffBadge } from './DiffBadge';

// ---------------------------------------------------------------------------
// CategoryRow
// ---------------------------------------------------------------------------

function CategoryRow({
  item,
  maxAmount,
}: {
  item: CategoryComparisonItem;
  maxAmount: number;
}) {
  const current = parseMoney(item.current_total);
  const compare = parseMoney(item.compare_total);
  const diff = parseMoney(item.diff);
  const progress = maxAmount > 0 ? (current / maxAmount) * 100 : 0;

  return (
    <div className="space-y-1.5 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium text-foreground">
          {item.category_name}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="tabular-nums text-sm font-semibold text-foreground">
            {formatCurrency(current)}
          </span>
          <DiffBadge diff={diff} percent={item.percent} invertColor />
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />
      <p className="text-xs text-muted-foreground">Kỳ trước: {formatCurrency(compare)}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CategoryListSkeleton
// ---------------------------------------------------------------------------

export function CategoryListSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Skeleton className="mb-1 h-5 w-44" />
      <Skeleton className="mb-5 h-3 w-48" />
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2 py-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CategoryComparisonTable
// ---------------------------------------------------------------------------

interface CategoryComparisonTableProps {
  items: CategoryComparisonItem[];
  maxAmount: number;
  currentLabel: string;
  compareLabel: string;
}

export function CategoryComparisonTable({
  items,
  maxAmount,
  currentLabel,
  compareLabel,
}: CategoryComparisonTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Chi tiêu theo danh mục</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {currentLabel} · so với {compareLabel}
      </p>
      <div className="mt-2 divide-y divide-border">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu chi tiêu trong hai kỳ này.
          </p>
        ) : (
          items.map((item) => (
            <CategoryRow key={item.category_id} item={item} maxAmount={maxAmount} />
          ))
        )}
      </div>
    </div>
  );
}
