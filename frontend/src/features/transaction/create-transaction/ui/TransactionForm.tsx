import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCategoriesQuery } from '@/entities/category';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { transactionFormSchema, type TransactionFormValues } from '../model/schema';

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

export function TransactionForm({
  defaultValues,
  isSubmitting,
  submitText = 'Lưu giao dịch',
  onSubmit
}: TransactionFormProps) {
  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData ?? [];

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      category_id: '',
      amount: '',
      type: 'expense',
      date: getTodayValue(),
      note: '',
      source: 'manual'
    }
  });

  useEffect(() => {
    form.reset({
      category_id: defaultValues?.category_id ?? '',
      amount: defaultValues?.amount !== undefined ? String(defaultValues.amount) : '',
      type: defaultValues?.type ?? 'expense',
      date: defaultValues?.date ?? getTodayValue(),
      note: defaultValues?.note ?? '',
      source: defaultValues?.source ?? 'manual'
    });
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giao dịch</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
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
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: any) => {
                    const categoryId = String(category.id ?? category._id ?? '');

                    return (
                      <SelectItem key={categoryId} value={categoryId}>
                        {category.icon ? `${category.icon} ` : ''}
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
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
                  className="min-h-[100px] rounded-xl"
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
          <Button type="submit" disabled={isSubmitting} className="h-10 rounded-xl px-5">
            {isSubmitting ? 'Đang lưu...' : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
