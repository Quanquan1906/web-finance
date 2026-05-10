export type TransactionDateFilterMode = 'all' | 'day' | 'month' | 'year';

export function buildTransactionDateRange(
  dateMode: TransactionDateFilterMode,
  selectedDate: string,
  selectedMonth: string,
  selectedYear: string,
): { date_from?: string; date_to?: string } {
  if (dateMode === 'day' && selectedDate) {
    return { date_from: selectedDate, date_to: selectedDate };
  }

  if (dateMode === 'month' && selectedMonth) {
    const [year, month] = selectedMonth.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return {
      date_from: `${year}-${String(month).padStart(2, '0')}-01`,
      date_to: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
    };
  }

  if (dateMode === 'year' && selectedYear) {
    return {
      date_from: `${selectedYear}-01-01`,
      date_to: `${selectedYear}-12-31`,
    };
  }

  return {};
}
