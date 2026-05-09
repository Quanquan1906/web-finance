import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { DashboardSummary } from '@/entities/dashboard';
import { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// StatCard — reusable stat tile
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  colorClass: string;
  bgClass: string;
}

export function StatCard({ label, value, icon, colorClass, bgClass }: StatCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', bgClass)}>
          <span className={colorClass}>{icon}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className={cn('text-2xl font-bold tracking-tight', colorClass)}>{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DashboardSummaryCards — 4-column grid
// ---------------------------------------------------------------------------

interface DashboardSummaryCardsProps {
  summary: DashboardSummary | undefined;
  periodLabel: string;
  isLoading: boolean;
  isError: boolean;
}

export function DashboardSummaryCards({
  summary,
  periodLabel,
  isLoading,
  isError,
}: DashboardSummaryCardsProps) {
  const periodBalance = parseFloat(summary?.period_balance ?? '0');
  const totalIncome = parseFloat(summary?.total_income ?? '0');
  const totalExpense = parseFloat(summary?.total_expense ?? '0');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label={`Chênh lệch thu chi ${periodLabel}`}
        value={formatCurrency(periodBalance)}
        icon={<TrendingUp className="h-4.5 w-4.5" />}
        colorClass={periodBalance >= 0 ? 'text-emerald-600' : 'text-destructive'}
        bgClass={periodBalance >= 0 ? 'bg-emerald-50' : 'bg-destructive/10'}
      />
      <StatCard
        label={`Tổng thu nhập ${periodLabel}`}
        value={formatCurrency(totalIncome)}
        icon={<ArrowUpCircle className="h-4.5 w-4.5" />}
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
      <StatCard
        label={`Tổng chi tiêu ${periodLabel}`}
        value={formatCurrency(totalExpense)}
        icon={<ArrowDownCircle className="h-4.5 w-4.5" />}
        colorClass="text-destructive"
        bgClass="bg-destructive/10"
      />
    </div>
  );
}
