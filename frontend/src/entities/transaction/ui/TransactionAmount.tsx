import { formatCurrency } from "@/shared/lib/formatCurrency";
import { cn } from "@/shared/lib/utils";

interface TransactionAmountProps {
  amount: number;
  type: "income" | "expense";
}

export function TransactionAmount({
  amount,
  type,
}: TransactionAmountProps) {
  const isIncome = type === "income";

  return (
    <span
      className={cn(
        "text-sm font-semibold",
        isIncome ? "text-emerald-600" : "text-slate-900"
      )}
    >
      {isIncome ? "+" : "-"}
      {formatCurrency(amount)}
    </span>
  );
}