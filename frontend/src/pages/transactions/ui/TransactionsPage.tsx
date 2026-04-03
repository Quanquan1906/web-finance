import { TransactionsPanel } from "@/widgets/transactions-panel";

export function TransactionsPage() {
  return (
    <div className="space-y-4 px-4 py-4 md:px-6 md:py-5">
      <div className="space-y-1">
        <h1 className="text-[22px] font-semibold leading-tight text-slate-900 md:text-[24px]">
          Danh sách giao dịch
        </h1>
        <p className="text-sm text-slate-500">
          Quản lý các khoản thu nhập và chi tiêu của bạn
        </p>
      </div>

      <TransactionsPanel />
    </div>
  );
}