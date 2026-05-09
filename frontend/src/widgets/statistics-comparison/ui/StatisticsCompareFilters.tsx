import { MonthYearSelector } from './MonthYearSelector';

interface StatisticsCompareFiltersProps {
  currentMonth: number;
  currentYear: number;
  compareMonth: number;
  compareYear: number;
  onCurrentMonthChange: (m: number) => void;
  onCurrentYearChange: (y: number) => void;
  onCompareMonthChange: (m: number) => void;
  onCompareYearChange: (y: number) => void;
}

export function StatisticsCompareFilters({
  currentMonth,
  currentYear,
  compareMonth,
  compareYear,
  onCurrentMonthChange,
  onCurrentYearChange,
  onCompareMonthChange,
  onCompareYearChange,
}: StatisticsCompareFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <MonthYearSelector
        label="Kỳ hiện tại:"
        month={currentMonth}
        year={currentYear}
        onMonthChange={onCurrentMonthChange}
        onYearChange={onCurrentYearChange}
      />
      <span className="text-sm font-semibold text-muted-foreground">vs</span>
      <MonthYearSelector
        label="So với:"
        month={compareMonth}
        year={compareYear}
        onMonthChange={onCompareMonthChange}
        onYearChange={onCompareYearChange}
      />
    </div>
  );
}
