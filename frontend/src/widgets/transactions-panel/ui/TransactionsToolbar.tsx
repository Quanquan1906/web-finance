import { CalendarDays, Search } from "lucide-react";

import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { TransactionDateFilterMode } from "../model/build-transaction-date-range";

interface CategoryOption {
  id: string;
  name: string;
}

interface TransactionsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: CategoryOption[];
  dateMode: TransactionDateFilterMode;
  onDateModeChange: (mode: TransactionDateFilterMode) => void;
  selectedDate: string;
  onSelectedDateChange: (val: string) => void;
  selectedMonth: string;
  onSelectedMonthChange: (val: string) => void;
  selectedYear: string;
  onSelectedYearChange: (val: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => String(CURRENT_YEAR - i)).filter(
  (y) => Number(y) >= 2020,
);

export function TransactionsToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  dateMode,
  onDateModeChange,
  selectedDate,
  onSelectedDateChange,
  selectedMonth,
  onSelectedMonthChange,
  selectedYear,
  onSelectedYearChange,
}: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm">
      {/* Row 1: search + filters */}
      <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo ghi chú..."
            className="h-10 rounded-xl border-border bg-background pl-10 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Category */}
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="h-10 min-w-44 rounded-xl border-border text-sm shadow-none focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date filter group — mode select + value input side by side */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <Select
              value={dateMode}
              onValueChange={(v) => {
                onDateModeChange(v as TransactionDateFilterMode);
              }}
            >
              <SelectTrigger className="h-auto border-0 p-0 text-sm shadow-none focus:ring-0 focus-visible:ring-0 [&>svg]:hidden">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="year">Theo năm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateMode === "day" && (
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectedDateChange(e.target.value)}
              className="h-10 w-44 rounded-xl border-border bg-background text-sm shadow-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          )}

          {dateMode === "month" && (
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => onSelectedMonthChange(e.target.value)}
              className="h-10 w-40 rounded-xl border-border bg-background text-sm shadow-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          )}

          {dateMode === "year" && (
            <Select value={selectedYear} onValueChange={onSelectedYearChange}>
              <SelectTrigger className="h-10 w-28 rounded-xl border-border text-sm shadow-none focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
