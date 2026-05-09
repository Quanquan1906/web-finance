import { type ReactNode } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { Skeleton } from '@/shared/ui/skeleton';
import { parseMoney } from '../lib/format-helpers';
import type { StatisticsCompareResponse } from '@/entities/statistics';
import { DiffBadge } from './DiffBadge';

// ---------------------------------------------------------------------------
// KpiCard
// ---------------------------------------------------------------------------

interface KpiCardProps {
  title: string;
  icon: ReactNode;
  iconColorClass: string;
  iconBgClass: string;
  currentLabel: string;
  compareLabel: string;
  currentValue: number;
  compareValue: number;
  diff: number;
  percent: number | null;
  invertColor?: boolean;
}

function KpiCard({
  title,
  icon,
  iconColorClass,
  iconBgClass,
  currentLabel,
  compareLabel,
  currentValue,
  compareValue,
  diff,
  percent,
  invertColor,
}: KpiCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            iconBgClass,
          )}
        >
          <span className={iconColorClass}>{icon}</span>
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {formatCurrency(currentValue)}
        </p>
        <p className="text-xs text-muted-foreground">{currentLabel}</p>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          {compareLabel}:{' '}
          <span className="font-medium text-foreground">{formatCurrency(compareValue)}</span>
        </p>
        <DiffBadge diff={diff} percent={percent} invertColor={invertColor} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KpiSkeletons
// ---------------------------------------------------------------------------

export function KpiSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatisticsCompareCards — 3 KPI cards grid
// ---------------------------------------------------------------------------

interface StatisticsCompareCardsProps {
  data: StatisticsCompareResponse | undefined;
  currentLabel: string;
  compareLabel: string;
}

export function StatisticsCompareCards({
  data,
  currentLabel,
  compareLabel,
}: StatisticsCompareCardsProps) {
  const currentIncome = parseMoney(data?.current.total_income);
  const currentExpense = parseMoney(data?.current.total_expense);
  const currentBalance = parseMoney(data?.current.period_balance);
  const compareIncome = parseMoney(data?.compare.total_income);
  const compareExpense = parseMoney(data?.compare.total_expense);
  const compareBalance = parseMoney(data?.compare.period_balance);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard
        title="Thu nhập"
        icon={<TrendingUp className="h-4.5 w-4.5" />}
        iconColorClass="text-emerald-600"
        iconBgClass="bg-emerald-50"
        currentLabel={currentLabel}
        compareLabel={compareLabel}
        currentValue={currentIncome}
        compareValue={compareIncome}
        diff={parseMoney(data?.difference.income_diff)}
        percent={data?.difference.income_percent ?? null}
      />
      <KpiCard
        title="Chi tiêu"
        icon={<TrendingDown className="h-4.5 w-4.5" />}
        iconColorClass="text-destructive"
        iconBgClass="bg-destructive/10"
        currentLabel={currentLabel}
        compareLabel={compareLabel}
        currentValue={currentExpense}
        compareValue={compareExpense}
        diff={parseMoney(data?.difference.expense_diff)}
        percent={data?.difference.expense_percent ?? null}
        invertColor
      />
      <KpiCard
        title="Số dư (Thu − Chi)"
        icon={<Wallet className="h-4.5 w-4.5" />}
        iconColorClass={currentBalance >= 0 ? 'text-blue-600' : 'text-destructive'}
        iconBgClass={currentBalance >= 0 ? 'bg-blue-50' : 'bg-destructive/10'}
        currentLabel={currentLabel}
        compareLabel={compareLabel}
        currentValue={currentBalance}
        compareValue={compareBalance}
        diff={parseMoney(data?.difference.balance_diff)}
        percent={data?.difference.balance_percent ?? null}
      />
    </div>
  );
}
