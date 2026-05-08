import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import {
  categoryFormSchema,
  DEFAULT_CATEGORY_FORM_VALUES,
  type CategoryFormValues
} from '../model/categoryFormSchema';

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  submitLabel: string;
  isSubmitting?: boolean;
  /** Pass true when editing — kind is immutable after creation */
  hideKind?: boolean;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function CategoryForm({
  initialValues,
  submitLabel,
  isSubmitting = false,
  hideKind = false,
  onSubmit,
  onCancel
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      ...DEFAULT_CATEGORY_FORM_VALUES,
      ...initialValues
    }
    
  });

  useEffect(() => {
    form.reset({
      ...DEFAULT_CATEGORY_FORM_VALUES,
      ...initialValues
    });
  }, [form, initialValues]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!hideKind && (
        <div className="space-y-2">
          <Label htmlFor="category-kind">Loại danh mục</Label>
          <Select
            value={form.watch('kind')}
            onValueChange={(v) => form.setValue('kind', v as 'income' | 'expense', { shouldValidate: true })}
          >
            <SelectTrigger id="category-kind" className="h-11 rounded-xl">
              <SelectValue placeholder="Chọn loại danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Chi tiêu</SelectItem>
              <SelectItem value="income">Thu nhập</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.kind ? (
            <p className="text-sm text-red-600">{form.formState.errors.kind.message}</p>
          ) : null}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category-name">Tên danh mục</Label>
        <Input id="category-name" placeholder="Ví dụ: Ăn uống" {...form.register('name')} />
        {form.formState.errors.name ? (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
