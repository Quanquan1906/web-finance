import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { Progress } from '@/shared/ui/progress';
import type { DashboardOverview, DashboardPeriod } from '@/entities/dashboard';

type BudgetProgressItem = DashboardOverview['budget_progress'][number];

interface BudgetProgressCardProps {
  items: BudgetProgressItem[];
  period: DashboardPeriod;
}

export function BudgetProgressCard({ items, period }: BudgetProgressCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-foreground">Tiến độ ngân sách</h2>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          {period !== 'month'
            ? 'Tiến độ ngân sách chỉ hiển thị khi xem theo tháng'
            : 'Chưa thiết lập ngân sách'}
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const percentage = Math.min(parseFloat(item.percentage_used), 100);
            return (
              <div key={item.budget_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={cn(
                      'font-medium',
                      item.is_over_budget ? 'text-destructive' : 'text-foreground',
                    )}
                  >
                    {item.category_name}
                    {item.is_over_budget && (
                      <span className="ml-1.5 text-xs font-normal">(Vượt ngân sách)</span>
                    )}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(parseFloat(item.spent))} /{' '}
                    {formatCurrency(parseFloat(item.amount_limit))}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className={cn(item.is_over_budget ? '[&>div]:bg-destructive' : '')}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
