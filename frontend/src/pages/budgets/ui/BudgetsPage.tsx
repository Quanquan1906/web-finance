import { BudgetOverviewPanel } from '@/widgets/budget-overview';

export function BudgetsPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ngân sách</h1>
        <p className="text-sm text-muted-foreground">
          Đặt giới hạn chi tiêu theo danh mục và theo dõi tiến độ hàng tháng
        </p>
      </div>

      <BudgetOverviewPanel />
    </div>
  );
}
