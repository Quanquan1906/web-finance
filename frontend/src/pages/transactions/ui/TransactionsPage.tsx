import { TransactionsPanel } from "@/widgets/transactions-panel";

export function TransactionsPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Giao dịch
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý các khoản thu nhập và chi tiêu của bạn
        </p>
      </div>

      <TransactionsPanel />
    </div>
  );
}
