import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useStatisticsCompareQuery } from '@/entities/statistics';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart';
import { Skeleton } from '@/shared/ui/skeleton';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { useStatisticsCompareFilter } from '../model/use-statistics-compare-filter';
import { parseMoney, abbreviate } from '../lib/format-helpers';
import { KpiSkeletons, StatisticsCompareCards } from './StatisticsCompareCards';
import { CategoryComparisonTable, CategoryListSkeleton } from './CategoryComparisonTable';
import { StatisticsCompareFilters } from './StatisticsCompareFilters';

const CHART_CONFIG = {
  current: { label: 'Ky hien tai', color: 'hsl(var(--chart-1))' },
  compare: { label: 'Ky so sanh', color: 'hsl(var(--chart-2))' },
} as const;

function SectionSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Skeleton className="mb-1 h-5 w-44" />
      <Skeleton className="mb-5 h-3 w-56" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function StatisticsComparisonWidget() {
  const { filters, setCurrentMonth, setCurrentYear, setCompareMonth, setCompareYear } =
    useStatisticsCompareFilter();

  const { data, isLoading } = useStatisticsCompareQuery(filters);

  const currentLabel =
    data?.current.label ?? `Thang ${filters.current_month}/${filters.current_year}`;
  const compareLabel =
    data?.compare.label ?? `Thang ${filters.compare_month}/${filters.compare_year}`;

  const currentIncome = parseMoney(data?.current.total_income);
  const currentExpense = parseMoney(data?.current.total_expense);
  const compareIncome = parseMoney(data?.compare.total_income);
  const compareExpense = parseMoney(data?.compare.total_expense);

  const chartData = data
    ? [
        { name: 'Thu nhap', current: currentIncome, compare: compareIncome },
        { name: 'Chi tieu', current: currentExpense, compare: compareExpense },
      ]
    : [];

  const maxCategoryAmount =
    data?.category_comparison.reduce(
      (acc, item) => Math.max(acc, parseMoney(item.current_total)),
      0,
    ) ?? 0;

  return (
    <div className="space-y-6">
      {/* Header + period filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Thống kê tài chính
          </h1>
          <p className="text-sm text-muted-foreground">So sánh thu chi giữa hai kỳ</p>
        </div>
        <StatisticsCompareFilters
          currentMonth={filters.current_month}
          currentYear={filters.current_year}
          compareMonth={filters.compare_month}
          compareYear={filters.compare_year}
          onCurrentMonthChange={setCurrentMonth}
          onCurrentYearChange={setCurrentYear}
          onCompareMonthChange={setCompareMonth}
          onCompareYearChange={setCompareYear}
        />
      </div>

      {/* KPI cards */}
      {isLoading ? (
        <KpiSkeletons />
      ) : (
        <StatisticsCompareCards
          data={data}
          currentLabel={currentLabel}
          compareLabel={compareLabel}
        />
      )}

      {/* Chart + Category */}
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <SectionSkeleton />
          <CategoryListSkeleton />
        </div>
      ) : !data ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-sm">
          Chua co du lieu de so sanh trong hai ky nay.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Bar chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">
              So sanh thu chi theo ky
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {currentLabel} so với {compareLabel}
            </p>
            <div className="mt-4">
              <ChartContainer config={CHART_CONFIG} className="h-64 w-full">
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                  barCategoryGap="30%"
                  barGap={3}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={abbreviate}
                    width={52}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'hsl(var(--muted))', radius: 6 }}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="flex min-w-37 items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                              {name === 'current' ? currentLabel : compareLabel}
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(Number(value))}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="current"
                    name="current"
                    fill="hsl(var(--chart-1))"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="compare"
                    name="compare"
                    fill="hsl(var(--chart-2))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* Category comparison */}
          <CategoryComparisonTable
            items={data.category_comparison}
            maxAmount={maxCategoryAmount}
            currentLabel={currentLabel}
            compareLabel={compareLabel}
          />
        </div>
      )}
    </div>
  );
}
