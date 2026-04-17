import { useMemo } from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useTransactionsQuery } from "@/entities/transaction";
import { formatCurrency } from "@/shared/lib/formatCurrency";
import { cn } from "@/shared/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  colorClass: string;
  bgClass: string;
}

function StatCard({ label, value, icon, trend, colorClass, bgClass }: StatCardProps) {
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
        {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data: transactionsData, isLoading } = useTransactionsQuery();
  const transactions = transactionsData?.items ?? [];

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tổng quan tài chính</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi thu chi và số dư tài khoản của bạn
        </p>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Số dư hiện tại"
            value={formatCurrency(stats.balance)}
            icon={<Wallet className="h-4.5 w-4.5" />}
            trend={`Từ ${transactions.length} giao dịch`}
            colorClass={stats.balance >= 0 ? "text-emerald-600" : "text-destructive"}
            bgClass={stats.balance >= 0 ? "bg-emerald-50" : "bg-destructive/10"}
          />
          <StatCard
            label="Tổng thu nhập"
            value={formatCurrency(stats.totalIncome)}
            icon={<ArrowUpCircle className="h-4.5 w-4.5" />}
            trend={`${transactions.filter((t) => t.type === "income").length} khoản thu`}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
          <StatCard
            label="Tổng chi tiêu"
            value={formatCurrency(stats.totalExpense)}
            icon={<ArrowDownCircle className="h-4.5 w-4.5" />}
            trend={`${transactions.filter((t) => t.type === "expense").length} khoản chi`}
            colorClass="text-destructive"
            bgClass="bg-destructive/10"
          />
        </div>
      )}

      {/* Recent transactions preview */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">Giao dịch gần đây</h2>
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
            <p className="text-xs text-muted-foreground/70">Hãy thêm giao dịch đầu tiên của bạn</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.slice(0, 5).map((t) => (
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
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    t.type === "income" ? "text-emerald-600" : "text-destructive"
                  )}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
