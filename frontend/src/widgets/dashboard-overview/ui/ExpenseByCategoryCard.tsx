import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { ExpenseByCategoryItem } from '@/entities/dashboard';

interface ExpenseByCategoryCardProps {
  items: ExpenseByCategoryItem[];
}

export function ExpenseByCategoryCard({ items }: ExpenseByCategoryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-foreground">Chi tiêu theo danh mục</h2>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Không có dữ liệu chi tiêu
        </p>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item) => (
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
  );
}
