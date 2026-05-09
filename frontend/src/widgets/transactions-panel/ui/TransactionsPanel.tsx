import { useMemo } from 'react';

import { useCategoriesQuery } from '@/entities/category';
import { useTransactionsQuery, type Transaction } from '@/entities/transaction';
import { CreateTransactionDialog } from '@/features/transaction/create-transaction';
import { DeleteTransactionDialog } from '@/features/transaction/delete-transaction';
import { EditTransactionDialog } from '@/features/transaction/edit-transaction';
import { useTransactionTableState } from '../model/use-transaction-table-state';
import { TransactionsActions } from './TransactionsActions';
import { TransactionsTable } from './TransactionsTable';
import { TransactionsToolbar } from './TransactionsToolbar';

type CategoryLite = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
};

export function TransactionsPanel() {
  const {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    createOpen,
    setCreateOpen,
    editOpen,
    deleteOpen,
    selectedTransaction,
    openEdit,
    openDelete,
    closeEdit,
    closeDelete,
  } = useTransactionTableState();

  const { data: transactionsData, isLoading, isError } = useTransactionsQuery();
  const { data: categoriesData } = useCategoriesQuery();

  const transactions = transactionsData?.items ?? [];
  const categories: CategoryLite[] = categoriesData ?? [];

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return transactions.filter((transaction: Transaction) => {
      const matchesCategory =
        categoryFilter === 'all' || transaction.category_id === categoryFilter;

      const matchesSearch = keyword
        ? (transaction.note ?? '').toLowerCase().includes(keyword)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [transactions, search, categoryFilter]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
        <div className="text-sm text-destructive">Không tải được danh sách giao dịch.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <TransactionsActions
        onOpenCreate={() => setCreateOpen(true)}
        onOpenNlp={() => {
          console.log('open nlp');
        }}
      />

      <TransactionsToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />

      <TransactionsTable
        transactions={filteredTransactions}
        categoryMap={categoryMap}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <CreateTransactionDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditTransactionDialog open={editOpen} onOpenChange={closeEdit} transaction={selectedTransaction} />
      <DeleteTransactionDialog open={deleteOpen} onOpenChange={closeDelete} transaction={selectedTransaction} />
    </div>
  );
}
