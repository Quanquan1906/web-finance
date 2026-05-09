import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { formatDate } from '@/shared/lib/formatDate';
import type { DashboardRecentTransaction } from '@/entities/dashboard';

interface RecentTransactionsCardProps {
  transactions: DashboardRecentTransaction[];
  isLoading: boolean;
}

export function RecentTransactionsCard({ transactions, isLoading }: RecentTransactionsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-foreground">Giao dịch trong kỳ</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Chưa có giao dịch nào</p>
          <p className="text-xs text-muted-foreground/70">
            Hãy thêm giao dịch đầu tiên của bạn
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    transaction.type === 'income' ? 'bg-emerald-50' : 'bg-destructive/10',
                  )}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {transaction.note || 'Giao dịch'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.transaction_date)}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'text-sm font-semibold',
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-destructive',
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(parseFloat(String(transaction.amount)))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
