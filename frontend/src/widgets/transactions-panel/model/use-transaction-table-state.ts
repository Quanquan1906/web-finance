import { useState } from 'react';
import type { Transaction } from '@/entities/transaction';

export function useTransactionTableState() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  function openEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setEditOpen(true);
  }

  function openDelete(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setDeleteOpen(true);
  }

  function closeEdit(open: boolean) {
    setEditOpen(open);
    if (!open) setSelectedTransaction(null);
  }

  function closeDelete(open: boolean) {
    setDeleteOpen(open);
    if (!open) setSelectedTransaction(null);
  }

  return {
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
  };
}
