import { useState } from 'react';
import type { Transaction } from '@/entities/transaction';
import type { TransactionDateFilterMode } from './build-transaction-date-range';

export function useTransactionTableState() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateMode, setDateMode] = useState<TransactionDateFilterMode>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [nlpOpen, setNlpOpen] = useState(false);
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
    dateMode,
    setDateMode,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    createOpen,
    setCreateOpen,
    nlpOpen,
    setNlpOpen,
    editOpen,
    deleteOpen,
    selectedTransaction,
    openEdit,
    openDelete,
    closeEdit,
    closeDelete,
  };
}
