import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useDashboardQuery, type DashboardPreset } from "@/entities/dashboard";
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
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

function StatCard({ label, value, icon, colorClass, bgClass }: StatCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", bgClass)}>
          <span className={colorClass}>{icon}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className={cn("text-2xl font-bold tracking-tight", colorClass)}>{value}</p>
      </div>
    </div>
  );
}

const PRESET_LABELS: Record<DashboardPreset, string> = {
  current_month: "Tháng này",
  current_year: "Năm này",
  last_15_days: "15 ngày qua",
};

export function DashboardPage() {
  const [preset, setPreset] = useState<DashboardPreset>("current_month");
  const { data, isLoading, isError } = useDashboardQuery({ preset });

  const summary = data?.summary;
  const recentTransactions = data?.recent_transactions ?? [];
  const expenseByCategory = data?.expense_by_category ?? [];
  const budgetProgress = data?.budget_progress ?? [];

  const balance = parseFloat(summary?.balance ?? "0");
  const totalIncome = parseFloat(summary?.total_income ?? "0");
  const totalExpense = parseFloat(summary?.total_expense ?? "0");

  return (
    <div className="space-y-6">
      {/* Header + preset filter */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tổng quan tài chính</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi thu chi và số dư tài khoản của bạn
          </p>
        </div>
        <Select value={preset} onValueChange={(v) => setPreset(v as DashboardPreset)}>
          <SelectTrigger className="w-40 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PRESET_LABELS) as DashboardPreset[]).map((key) => (
              <SelectItem key={key} value={key}>
                {PRESET_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Không thể tải dữ liệu. Vui lòng thử lại.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Số dư"
            value={formatCurrency(balance)}
            icon={<Wallet className="h-4.5 w-4.5" />}
            colorClass={balance >= 0 ? "text-emerald-600" : "text-destructive"}
            bgClass={balance >= 0 ? "bg-emerald-50" : "bg-destructive/10"}
          />
          <StatCard
            label="Tổng thu nhập"
            value={formatCurrency(totalIncome)}
            icon={<ArrowUpCircle className="h-4.5 w-4.5" />}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
          <StatCard
            label="Tổng chi tiêu"
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
            <h2 className="mb-4 text-base font-semibold text-foreground">Chi tiêu theo danh mục</h2>
            {expenseByCategory.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Không có dữ liệu chi tiêu
              </p>
            ) : (
              <div className="divide-y divide-border">
                {expenseByCategory.map((item) => (
                  <div key={item.category_id} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-foreground">{item.category_name}</span>
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
            <h2 className="mb-4 text-base font-semibold text-foreground">Tiến độ ngân sách</h2>
            {budgetProgress.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {preset !== "current_month"
                  ? "Tiến độ ngân sách chỉ hiển thị trong chế độ tháng này"
                  : "Chưa thiết lập ngân sách"}
              </p>
            ) : (
              <div className="space-y-4">
                {budgetProgress.map((item) => {
                  const pct = Math.min(parseFloat(item.percentage_used), 100);
                  return (
                    <div key={item.budget_id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={cn(
                            "font-medium",
                            item.is_over_budget ? "text-destructive" : "text-foreground"
                          )}
                        >
                          {item.category_name}
                          {item.is_over_budget && (
                            <span className="ml-1.5 text-xs font-normal">(Vượt ngân sách)</span>
                          )}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(parseFloat(item.spent))} /{" "}
                          {formatCurrency(parseFloat(item.amount_limit))}
                        </span>
                      </div>
                      <Progress
                        value={pct}
                        className={cn(item.is_over_budget ? "[&>div]:bg-destructive" : "")}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">Giao dịch gần đây</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Wallet className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">Chưa có giao dịch nào</p>
            <p className="text-xs text-muted-foreground/70">Hãy thêm giao dịch đầu tiên của bạn</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      t.type === "income" ? "bg-emerald-50" : "bg-destructive/10"
                    )}
                  >
                    {t.type === "income" ? (
                      <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.note || "Giao dịch"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(t.transaction_date)}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    t.type === "income" ? "text-emerald-600" : "text-destructive"
                  )}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(parseFloat(String(t.amount)))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
