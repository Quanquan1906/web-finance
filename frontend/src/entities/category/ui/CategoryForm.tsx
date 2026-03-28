import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/lib/utils';

import {
  categoryFormSchema,
  DEFAULT_CATEGORY_FORM_VALUES,
  type CategoryFormValues
} from '../model/categoryFormSchema';
import { CATEGORY_COLOR_OPTIONS } from '../model/categoryColorOptions';
import { CategoryIconSelect } from './CategorySelect';

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

  const selectedColor = form.watch('color');

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

      <div className="space-y-2">
        <Label>Icon</Label>
        <CategoryIconSelect
          value={form.watch('icon')}
          onChange={(value) =>
            form.setValue('icon', value, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true
            })
          }
        />

        {form.formState.errors.icon ? (
          <p className="text-sm text-red-600">{form.formState.errors.icon.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Màu sắc</Label>
        <div className="flex flex-wrap gap-3">
          {CATEGORY_COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                form.setValue('color', color, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true
                })
              }
              className={cn(
                'size-9 rounded-full border-2 transition-all',
                color,
                selectedColor === color ? 'scale-105 border-slate-900' : 'border-transparent'
              )}
              aria-label={`Chọn màu ${color}`}
            />
          ))}
        </div>
        {form.formState.errors.color ? (
          <p className="text-sm text-red-600">{form.formState.errors.color.message}</p>
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
