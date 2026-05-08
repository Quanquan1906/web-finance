import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCategoriesQuery } from '@/entities/category';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import {
  budgetFormSchema,
  getDefaultBudgetFormValues,
  type BudgetFormValues,
} from '../model/schema';

const MONTHS = [
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
];

function getYearOptions(): { value: string; label: string }[] {
  const current = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = current - 2; y <= current + 5; y++) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

interface BudgetFormProps {
  initialValues?: Partial<BudgetFormValues>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: BudgetFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export function BudgetForm({
  initialValues,
  isSubmitting,
  submitLabel = 'Lưu ngân sách',
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const { data: categoriesData = [] } = useCategoriesQuery();
  const yearOptions = getYearOptions();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      ...getDefaultBudgetFormValues(),
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...getDefaultBudgetFormValues(),
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Category */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              {categoriesData.length === 0 ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Bạn chưa có danh mục nào. Vui lòng tạo danh mục trước.
                </p>
              ) : (
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesData.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Month + Year in 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tháng</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Chọn tháng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Chọn năm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y.value} value={y.value}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới hạn ngân sách (đ)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số tiền giới hạn"
                  className="h-11 rounded-xl"
                  min={1}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-1">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onCancel}
            >
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 rounded-xl"
            disabled={isSubmitting || categoriesData.length === 0}
          >
            {isSubmitting ? 'Đang lưu...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
