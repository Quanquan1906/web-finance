import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCategoriesQuery, type CategoryKind } from '@/entities/category';
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
import { Textarea } from '@/shared/ui/textarea';
import {
  transactionFormSchema,
  type TransactionFormValues,
} from '../model/schema';

interface TransactionFormDefaults extends Partial<TransactionFormValues> {
  amount?: string;
}

interface TransactionFormProps {
  defaultValues?: TransactionFormDefaults;
  isSubmitting?: boolean;
  submitText?: string;
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
}

function getTodayValue() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

function normalizeDateInputValue(value?: string) {
  if (!value) return getTodayValue();

  // Nếu BE trả ISO datetime: 2026-05-09T00:00:00
  if (value.includes('T')) {
    return value.slice(0, 10);
  }

  // Nếu đã đúng format input date: 2026-05-09
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return value;
}

export function TransactionForm({
  defaultValues,
  isSubmitting,
  submitText = 'Lưu giao dịch',
  onSubmit,
}: TransactionFormProps) {
  const { data: categoriesData } = useCategoriesQuery();

  const allCategories = useMemo(() => {
    return categoriesData ?? [];
  }, [categoriesData]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      category_id: defaultValues?.category_id ?? '',
      amount:
        defaultValues?.amount !== undefined ? String(defaultValues.amount) : '',
      type: defaultValues?.type ?? 'expense',
      transaction_date: normalizeDateInputValue(defaultValues?.transaction_date),
      note: defaultValues?.note ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      category_id: defaultValues?.category_id ?? '',
      amount:
        defaultValues?.amount !== undefined
          ? String(defaultValues.amount)
          : '',
      type: defaultValues?.type ?? 'expense',
      transaction_date: normalizeDateInputValue(defaultValues?.transaction_date),
      note: defaultValues?.note ?? '',
    });
  }, [defaultValues, form]);

  const selectedType = useWatch({
    control: form.control,
    name: 'type',
  });

  const filteredCategories = useMemo(() => {
    return allCategories.filter(
      (category) => category.kind === (selectedType as CategoryKind),
    );
  }, [allCategories, selectedType]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giao dịch</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('category_id', '', { shouldValidate: false });
                }}
              >
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Chọn loại giao dịch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Chi tiêu</SelectItem>
                  <SelectItem value="income">Thu nhập</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số tiền"
                  className="h-11 rounded-xl"
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select
                value={field.value || undefined}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                      Chưa có danh mục{' '}
                      {selectedType === 'income' ? 'thu nhập' : 'chi tiêu'}
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="h-11 rounded-xl"
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ví dụ: Ăn sáng phở"
                  className="min-h-25 rounded-xl"
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-xl px-5"
          >
            {isSubmitting ? 'Đang lưu...' : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}