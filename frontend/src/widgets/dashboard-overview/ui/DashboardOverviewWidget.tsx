import { useDashboardQuery } from "@/entities/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useDashboardPeriodFilter } from "../model/use-dashboard-period-filter";
import { BudgetProgressCard } from "./BudgetProgressCard";
import { DashboardSummaryCards } from "./DashboardSummaryCards";
import { ExpenseByCategoryCard } from "./ExpenseByCategoryCard";
import { RecentTransactionsCard } from "./RecentTransactionsCard";

export function DashboardOverviewWidget() {
  const {
    period,
    selectedDate,
    selectedMonth,
    selectedYear,
    currentYear,
    setPeriod,
    setSelectedDate,
    setSelectedMonth,
    setSelectedYear,
    dashboardFilters,
    periodLabel,
  } = useDashboardPeriodFilter();

  const { data, isLoading, isError } = useDashboardQuery(dashboardFilters);

  const recentTransactions = data?.recent_transactions ?? [];
  const expenseByCategory = data?.expense_by_category ?? [];
  const budgetProgress = data?.budget_progress ?? [];

  return (
    <div className="space-y-6">
      {/* Header + period filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tổng quan tài chính
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi thu chi theo ngày, tháng hoặc năm
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as typeof period)}
          >
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Theo ngày</SelectItem>
              <SelectItem value="month">Theo tháng</SelectItem>
              <SelectItem value="year">Theo năm</SelectItem>
            </SelectContent>
          </Select>

          {period === "day" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring"
            />
          )}

          {period === "month" && (
            <Select
              value={String(selectedMonth)}
              onValueChange={(v) => setSelectedMonth(Number(v))}
            >
              <SelectTrigger className="w-32 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    Tháng {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(period === "month" || period === "year") && (
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-28 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => currentYear - i).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <DashboardSummaryCards
        summary={data?.summary}
        periodLabel={periodLabel}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Expense by category + Budget progress */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ExpenseByCategoryCard items={expenseByCategory} />
          <BudgetProgressCard items={budgetProgress} period={period} />
        </div>
      )}

      {/* Recent transactions */}
      <RecentTransactionsCard
        transactions={recentTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}
