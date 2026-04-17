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
        "text-sm font-semibold tabular-nums",
        isIncome ? "text-emerald-600" : "text-destructive"
      )}
    >
      {isIncome ? "+" : "-"}
      {formatCurrency(amount)}
    </span>
  );
}