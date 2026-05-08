import { useMemo, useState } from 'react';
import { Plus, PiggyBank } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useBudgetsQuery, useBudgetProgressQuery } from '@/entities/budget';
import type { Budget } from '@/entities/budget';
import { CreateBudgetDialog } from '@/features/budget/create-budget';
import { EditBudgetDialog } from '@/features/budget/edit-budget';
import { DeleteBudgetDialog } from '@/features/budget/delete-budget';

import { BudgetProgressCard } from './BudgetProgressCard';

const MONTHS = [
  { value: '1', label: 'Tháng 1' }, { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' }, { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' }, { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' }, { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' }, { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' }, { value: '12', label: 'Tháng 12' },
];

function getYearOptions() {
  const current = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = current - 2; y <= current + 2; y++) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

export function BudgetOverviewPanel() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const [createOpen, setCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);
  const [deletingLabel, setDeletingLabel] = useState('');

  const monthNum = Number(selectedMonth);
  const yearNum = Number(selectedYear);

  // Fetch budget list for building edit/delete budget object lookup
  const { data: budgetList = [] } = useBudgetsQuery({
    year: yearNum,
    month: monthNum,
  });

  // Budget progress is the primary display source
  const {
    data: progressItems = [],
    isLoading,
    isError,
    refetch,
  } = useBudgetProgressQuery(yearNum, monthNum);

  // Map budget_id -> Budget for edit/delete
  const budgetById = useMemo<Record<string, Budget>>(() => {
    return Object.fromEntries(budgetList.map((b) => [b.id, b]));
  }, [budgetList]);

  const yearOptions = getYearOptions();

  const handleOpenDelete = (budgetId: string, label: string) => {
    setDeletingBudgetId(budgetId);
    setDeletingLabel(label);
  };

  return (
    <div className="space-y-5">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-32 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-28 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y.value} value={y.value}>
                {y.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-10 rounded-xl px-5 text-sm font-semibold shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm ngân sách
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">
            Không thể tải dữ liệu ngân sách. Vui lòng thử lại.
          </p>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      ) : progressItems.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <PiggyBank className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Chưa có ngân sách nào</p>
            <p className="text-sm text-muted-foreground">
              Tạo ngân sách để theo dõi chi tiêu theo từng danh mục
            </p>
          </div>
          <Button className="rounded-xl px-6" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo ngân sách đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {progressItems.map((item) => (
            <BudgetProgressCard
              key={item.budget_id}
              item={item}
              budget={budgetById[item.budget_id]}
              onEdit={setEditingBudget}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateBudgetDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditBudgetDialog
        open={editingBudget !== null}
        budget={editingBudget}
        onOpenChange={(open) => { if (!open) setEditingBudget(null); }}
      />

      <DeleteBudgetDialog
        open={deletingBudgetId !== null}
        budgetId={deletingBudgetId}
        label={deletingLabel}
        onOpenChange={(open) => { if (!open) setDeletingBudgetId(null); }}
      />
    </div>
  );
}
