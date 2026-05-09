import { useState, type ReactNode } from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

import {
  useDashboardQuery,
  type DashboardFilters,
  type DashboardPeriod,
} from "@/entities/dashboard";
import { formatCurrency } from "@/shared/lib/formatCurrency";
import { formatDate } from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Progress } from "@/shared/ui/progress";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  colorClass: string;
  bgClass: string;
}

function StatCard({ label, value, icon, colorClass, bgClass }: StatCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>

        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            bgClass,
          )}
        >
          <span className={colorClass}>{icon}</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className={cn("text-2xl font-bold tracking-tight", colorClass)}>
          {value}
        </p>
      </div>
    </div>
  );
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPeriodLabel(period: DashboardPeriod) {
  if (period === "day") return "trong ngày";
  if (period === "month") return "trong tháng";
  return "trong năm";
}

export function DashboardPage() {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(today));
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const dashboardFilters: DashboardFilters =
    period === "day"
      ? {
          period: "day",
          date: selectedDate,
        }
      : period === "month"
        ? {
            period: "month",
            month: selectedMonth,
            year: selectedYear,
          }
        : {
            period: "year",
            year: selectedYear,
          };

  const { data, isLoading, isError } = useDashboardQuery(dashboardFilters);

  const summary = data?.summary;
  const recentTransactions = data?.recent_transactions ?? [];
  const expenseByCategory = data?.expense_by_category ?? [];
  const budgetProgress = data?.budget_progress ?? [];

  const currentBalance = parseFloat(summary?.current_balance ?? "0");
  const periodBalance = parseFloat(summary?.period_balance ?? "0");
  const totalIncome = parseFloat(summary?.total_income ?? "0");
  const totalExpense = parseFloat(summary?.total_expense ?? "0");

  const periodLabel = getPeriodLabel(period);

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
            onValueChange={(value) => setPeriod(value as DashboardPeriod)}
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
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring"
            />
          )}

          {period === "month" && (
            <Select
              value={String(selectedMonth)}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger className="w-32 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (month) => (
                    <SelectItem key={month} value={String(month)}>
                      Tháng {month}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          )}

          {(period === "month" || period === "year") && (
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="w-28 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, index) => currentYear - index).map(
                  (year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border bg-muted"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Không thể tải dữ liệu. Vui lòng thử lại.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Số dư hiện tại"
            value={formatCurrency(currentBalance)}
            icon={<Wallet className="h-4.5 w-4.5" />}
            colorClass={currentBalance >= 0 ? "text-emerald-600" : "text-destructive"}
            bgClass={currentBalance >= 0 ? "bg-emerald-50" : "bg-destructive/10"}
          />

          <StatCard
            label={`Chênh lệch thu chi ${periodLabel}`}
            value={formatCurrency(periodBalance)}
            icon={<Wallet className="h-4.5 w-4.5" />}
            colorClass={periodBalance >= 0 ? "text-emerald-600" : "text-destructive"}
            bgClass={periodBalance >= 0 ? "bg-emerald-50" : "bg-destructive/10"}
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
      )}

      {/* Expense by category + Budget progress */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Expense by category */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Chi tiêu theo danh mục
            </h2>

            {expenseByCategory.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Không có dữ liệu chi tiêu
              </p>
            ) : (
              <div className="divide-y divide-border">
                {expenseByCategory.map((item) => (
                  <div
                    key={item.category_id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-sm text-foreground">
                      {item.category_name}
                    </span>
                    <span className="text-sm font-semibold text-destructive">
                      -{formatCurrency(parseFloat(item.total))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget progress */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Tiến độ ngân sách
            </h2>

            {budgetProgress.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {period !== "month"
                  ? "Tiến độ ngân sách chỉ hiển thị khi xem theo tháng"
                  : "Chưa thiết lập ngân sách"}
              </p>
            ) : (
              <div className="space-y-4">
                {budgetProgress.map((item) => {
                  const percentage = Math.min(
                    parseFloat(item.percentage_used),
                    100,
                  );

                  return (
                    <div key={item.budget_id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={cn(
                            "font-medium",
                            item.is_over_budget
                              ? "text-destructive"
                              : "text-foreground",
                          )}
                        >
                          {item.category_name}
                          {item.is_over_budget && (
                            <span className="ml-1.5 text-xs font-normal">
                              (Vượt ngân sách)
                            </span>
                          )}
                        </span>

                        <span className="text-muted-foreground">
                          {formatCurrency(parseFloat(item.spent))} /{" "}
                          {formatCurrency(parseFloat(item.amount_limit))}
                        </span>
                      </div>

                      <Progress
                        value={percentage}
                        className={cn(
                          item.is_over_budget ? "[&>div]:bg-destructive" : "",
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Giao dịch trong kỳ
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-10 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Wallet className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Chưa có giao dịch nào
            </p>
            <p className="text-xs text-muted-foreground/70">
              Hãy thêm giao dịch đầu tiên của bạn
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      transaction.type === "income"
                        ? "bg-emerald-50"
                        : "bg-destructive/10",
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {transaction.note || "Giao dịch"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-sm font-semibold",
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-destructive",
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(parseFloat(String(transaction.amount)))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}