import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowUp,
  Car,
  Clock3,
  Eye,
  Gamepad2,
  MoreHorizontal,
  PieChart as PieChartIcon,
  ReceiptText,
  ShoppingBag,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';
import {
  useExpenseByCategoryQuery,
  useReportSummaryQuery,
  type ReportFilters,
} from '@/entities/report';
import { useTransactionsQuery } from '@/entities/transaction';
import { useCategoriesQuery } from '@/entities/category';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { formatDate } from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';

type AnalyticsPeriod = 'all' | 'week' | 'month' | 'year' | 'custom';

const PERIOD_OPTIONS: Array<{ label: string; value: AnalyticsPeriod }> = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' },
  { label: 'Tùy chọn', value: 'custom' },
];

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPeriodFilters(period: Exclude<AnalyticsPeriod, 'custom'>): ReportFilters {
  if (period === 'all') return {};

  const now = new Date();
  const start = new Date(now);

  if (period === 'week') {
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diffToMonday);
  }

  if (period === 'month') {
    start.setDate(1);
  }

  if (period === 'year') {
    start.setMonth(0, 1);
  }

  start.setHours(0, 0, 0, 0);
  now.setHours(23, 59, 59, 999);

  return {
    date_from: toDateValue(start),
    date_to: toDateValue(now),
  };
}

function getCategoryIcon(name?: string) {
  const normalized = (name ?? '').toLowerCase();
  if (normalized.includes('ăn') || normalized.includes('food') || normalized.includes('uống')) {
    return Utensils;
  }
  if (normalized.includes('mua') || normalized.includes('shop')) return ShoppingBag;
  if (normalized.includes('di chuyển') || normalized.includes('xe')) return Car;
  if (normalized.includes('giải trí') || normalized.includes('game')) return Gamepad2;
  if (normalized.includes('điện') || normalized.includes('hóa đơn')) return Zap;
  if (normalized.includes('lương') || normalized.includes('thu')) return Wallet;
  return ReceiptText;
}

function getRelativeDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  return formatDate(value);
}

type DetailType = 'income' | 'expense';

interface DetailDialogProps {
  open: boolean;
  type: DetailType;
  rows: Array<{ category_id: string; category_name: string; total: string }>;
  onOpenChange: (open: boolean) => void;
}

function DetailDialog({ open, type, rows, onOpenChange }: DetailDialogProps) {
  const isIncome = type === 'income';
  const title = isIncome ? 'Chi tiết Thu nhập' : 'Chi tiết Chi tiêu';
  const amountClass = isIncome ? 'text-emerald-500' : 'text-red-500';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-auto bottom-0 max-h-[78vh] translate-y-0 rounded-t-[2rem] border-0 p-5 sm:top-[50%] sm:bottom-auto sm:max-w-xl sm:-translate-y-1/2 sm:rounded-[2rem] sm:p-6"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 text-left">
          <DialogTitle className="text-2xl font-bold md:text-3xl">{title}</DialogTitle>
          <DialogClose className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-muted/80">
            <span className="text-3xl leading-none">×</span>
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        <div className="mt-4 max-h-[52vh] overflow-auto pr-1">
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu trong kỳ này
            </p>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((item) => (
                <div key={item.category_id} className="flex items-center justify-between gap-4 py-4">
                  <span className="min-w-0 truncate text-lg font-medium text-foreground">
                    {item.category_name}
                  </span>
                  <span className={cn('shrink-0 text-lg font-bold md:text-xl', amountClass)}>
                    {formatCurrency(Number(item.total))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('month');
  const [detailType, setDetailType] = useState<DetailType | null>(null);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const filters = useMemo(() => {
    if (period !== 'custom') {
      return getPeriodFilters(period);
    }

    return {
      ...(customFrom ? { date_from: customFrom } : {}),
      ...(customTo ? { date_to: customTo } : {}),
    };
  }, [customFrom, customTo, period]);

  const summaryQuery = useReportSummaryQuery(filters);
  const expenseCategoryQuery = useExpenseByCategoryQuery({ ...filters, type: 'expense' });
  const incomeCategoryQuery = useExpenseByCategoryQuery({ ...filters, type: 'income' });
  const transactionsQuery = useTransactionsQuery({
    ...filters,
    limit: 4,
    offset: 0,
    sort_by: 'transaction_date',
    sort_order: 'desc',
  });
  const categoriesQuery = useCategoriesQuery();

  const summary = summaryQuery.data;
  const totalIncome = Number(summary?.total_income ?? 0);
  const totalExpense = Number(summary?.total_expense ?? 0);
  const balance = Number(summary?.balance ?? 0);
  const hasPieData = totalIncome > 0 || totalExpense > 0;

  const incomeExpenseData = [
    {
      name: 'Thu nhập',
      value: totalIncome,
      fill: '#10b981',
    },
    {
      name: 'Chi tiêu',
      value: totalExpense,
      fill: '#ef4444',
    },
  ].filter((item) => item.value > 0);

  const categoryRows = expenseCategoryQuery.data ?? [];
  const incomeRows = incomeCategoryQuery.data ?? [];
  const detailRows = detailType === 'income' ? incomeRows : categoryRows;
  const recentTransactions = transactionsQuery.data?.items ?? [];
  const categoryMap = useMemo(
    () => new Map((categoriesQuery.data ?? []).map((category) => [category.id, category])),
    [categoriesQuery.data]
  );
  const totalCategoryExpense = categoryRows.reduce((sum, item) => sum + Number(item.total), 0);
  const totalFlow = totalIncome + totalExpense;
  const incomePercent = totalFlow > 0 ? (totalIncome / totalFlow) * 100 : 0;
  const expensePercent = totalFlow > 0 ? (totalExpense / totalFlow) * 100 : 0;
  const isLoading =
    summaryQuery.isLoading ||
    expenseCategoryQuery.isLoading ||
    incomeCategoryQuery.isLoading ||
    transactionsQuery.isLoading ||
    categoriesQuery.isLoading;
  const isError =
    summaryQuery.isError ||
    expenseCategoryQuery.isError ||
    incomeCategoryQuery.isError ||
    transactionsQuery.isError ||
    categoriesQuery.isError;

  return (
    <div className="mx-auto flex h-[calc(100vh-6.5rem)] w-full max-w-7xl flex-col gap-3 overflow-hidden">
      <DetailDialog
        open={detailType !== null}
        type={detailType ?? 'expense'}
        rows={detailRows}
        onOpenChange={(open) => {
          if (!open) setDetailType(null);
        }}
      />

      <div className="flex shrink-0 items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Thống kê tài chính
        </h1>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-3xl border bg-muted/30 p-1.5">
        <div className="grid min-w-0 flex-1 grid-cols-5 gap-1.5">
          {PERIOD_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={cn(
                'h-9 rounded-2xl px-2 text-sm font-semibold transition-colors',
                period === item.value
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="flex shrink-0 items-center gap-1.5">
            <input
              type="date"
              value={customFrom}
              onChange={(event) => setCustomFrom(event.target.value)}
              className="h-9 rounded-2xl border bg-background px-3 text-sm text-foreground outline-none transition focus:border-emerald-500"
              aria-label="Từ ngày"
            />
            <span className="text-xs text-muted-foreground">đến</span>
            <input
              type="date"
              value={customTo}
              onChange={(event) => setCustomTo(event.target.value)}
              className="h-9 rounded-2xl border bg-background px-3 text-sm text-foreground outline-none transition focus:border-emerald-500"
              aria-label="Đến ngày"
            />
          </div>
        )}
      </div>

      {isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Không thể tải dữ liệu thống kê. Vui lòng thử lại.
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
            <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 p-5 text-white shadow-xl shadow-emerald-900/15">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <span>Số dư hiện tại</span>
                    <Eye className="h-4 w-4" />
                  </div>
                  <p className="mt-3 truncate text-4xl font-bold tracking-tight">
                    {isLoading ? '...' : formatCurrency(balance)}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
                    <Clock3 className="h-4 w-4" />
                    <span>Cập nhật theo kỳ đang chọn</span>
                  </div>
                </div>
                <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/15 md:flex">
                  <Wallet className="h-16 w-16 text-white/65" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDetailType('income')}
                  className="rounded-3xl bg-white/80 p-4 text-left text-foreground backdrop-blur transition hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600">
                      <ArrowDown className="h-5 w-5" />
                    </span>
                    <span className="text-sm text-muted-foreground">Tổng thu nhập</span>
                  </div>
                  <p className="mt-3 truncate text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-700">Chạm xem chi tiết</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailType('expense')}
                  className="rounded-3xl bg-white/80 p-4 text-left text-foreground backdrop-blur transition hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600">
                      <ArrowUp className="h-5 w-5" />
                    </span>
                    <span className="text-sm text-muted-foreground">Tổng chi tiêu</span>
                  </div>
                  <p className="mt-3 truncate text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-700">Chạm xem chi tiết</p>
                </button>
              </div>
            </div>

            <div className="min-h-0 rounded-[1.75rem] border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground">Chi tiêu theo danh mục</h2>
                <button
                  type="button"
                  onClick={() => setDetailType('expense')}
                  className="rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Xem chi tiết
                </button>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-11 animate-pulse rounded-2xl bg-muted" />
                  ))}
                </div>
              ) : categoryRows.length === 0 ? (
                <p className="flex h-full min-h-32 items-center justify-center text-center text-sm text-muted-foreground">
                  Chưa có dữ liệu chi tiêu trong kỳ này
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryRows.slice(0, 5).map((item) => {
                    const total = Number(item.total);
                    const percentage =
                      totalCategoryExpense > 0 ? Math.round((total / totalCategoryExpense) * 100) : 0;
                    const Icon = getCategoryIcon(item.category_name);

                    return (
                      <div key={item.category_id} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-foreground">{item.category_name}</p>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-emerald-600"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(total)}</p>
                          <p className="text-xs text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                  {categoryRows.length > 5 && (
                    <div className="flex justify-center pt-1 text-muted-foreground">
                      <MoreHorizontal className="h-5 w-5" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border bg-card p-4 shadow-sm">
              <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-bold text-foreground">Tổng quan thu chi</h2>
                </div>
                <span className="rounded-xl border px-3 py-1.5 text-sm text-foreground">
                  {PERIOD_OPTIONS.find((item) => item.value === period)?.label}
                </span>
              </div>

              {isLoading ? (
                <div className="min-h-0 flex-1 animate-pulse rounded-3xl bg-muted" />
              ) : !hasPieData ? (
                <div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl bg-muted/40 text-sm text-muted-foreground">
                  Chưa có dữ liệu thu chi trong kỳ này
                </div>
              ) : (
                <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  <ChartContainer
                    config={{
                      income: { label: 'Thu nhập', color: '#10b981' },
                      expense: { label: 'Chi tiêu', color: '#ef4444' },
                    }}
                    className="aspect-auto h-full min-h-0"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            hideLabel
                            formatter={(value, name) => (
                              <div className="flex min-w-36 items-center justify-between gap-4">
                                <span>{name}</span>
                                <span className="font-semibold">{formatCurrency(Number(value))}</span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Pie
                        data={incomeExpenseData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="74%"
                        strokeWidth={0}
                      >
                        {incomeExpenseData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  <div className="flex min-h-0 flex-col justify-center gap-2 overflow-hidden">
                    {incomeExpenseData.map((item) => {
                      const percent = item.name === 'Thu nhập' ? incomePercent : expensePercent;
                      return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setDetailType(item.name === 'Thu nhập' ? 'income' : 'expense')}
                        className="flex items-center gap-3 rounded-2xl border bg-background/60 p-2.5 text-left transition hover:bg-muted/50"
                      >
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-foreground">
                            {formatCurrency(item.value)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.name} · {percent.toFixed(1)}%
                          </p>
                        </div>
                      </button>
                    );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border bg-card p-4 shadow-sm">
              <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground">Giao dịch gần đây</h2>
                <Link
                  to="/transactions"
                  className="rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Xem tất cả
                </Link>
              </div>
              {isLoading ? (
                <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-10 animate-pulse rounded-2xl bg-muted" />
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="flex min-h-0 flex-1 items-center justify-center text-center text-sm text-muted-foreground">
                  Chưa có giao dịch trong kỳ này
                </p>
              ) : (
                <div className="min-h-0 flex-1 divide-y divide-border overflow-hidden">
                  {recentTransactions.map((transaction) => {
                    const category = categoryMap.get(transaction.category_id);
                    const Icon = getCategoryIcon(category?.name);
                    const isIncome = transaction.type === 'income';
                    const amount = Number(transaction.amount);

                    return (
                      <div key={transaction.id} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          {isIncome ? <Wallet className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {transaction.note || category?.name || 'Giao dịch'}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {category?.name || (isIncome ? 'Thu nhập' : 'Chi tiêu')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={cn('text-sm font-bold', isIncome ? 'text-emerald-600' : 'text-red-500')}>
                            {isIncome ? '+' : '-'}
                            {formatCurrency(amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeDate(transaction.transaction_date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
