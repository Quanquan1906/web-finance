import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import {
  categoryFormSchema,
  DEFAULT_CATEGORY_FORM_VALUES,
  type CategoryFormValues
} from '../model/categoryFormSchema';

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function CategoryForm({
  initialValues,
  submitLabel,
  isSubmitting = false,
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
