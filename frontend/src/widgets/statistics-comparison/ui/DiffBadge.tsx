import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { formatPercent } from '../lib/format-helpers';

interface DiffBadgeProps {
  diff: number;
  percent: number | null;
  invertColor?: boolean;
}

export function DiffBadge({ diff, percent, invertColor = false }: DiffBadgeProps) {
  const isNeutral = diff === 0;
  const isPositive = diff > 0;
  const isGood = invertColor ? !isPositive : isPositive;
  const display =
    formatPercent(percent) ??
    `${isPositive ? '+' : ''}${formatCurrency(Math.abs(diff))}`;

  if (isNeutral) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <Minus className="h-3 w-3" />
        Không đổi
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
        isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
      )}
    >
      {isGood ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {display}
    </span>
  );
}
