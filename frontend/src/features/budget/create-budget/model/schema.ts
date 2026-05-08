import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const budgetFormSchema = z.object({
  category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
  month: z
    .string()
    .min(1, 'Vui lòng chọn tháng')
    .refine((v) => {
      const n = Number(v);
      return n >= 1 && n <= 12;
    }, 'Tháng không hợp lệ'),
  year: z
    .string()
    .min(1, 'Vui lòng chọn năm')
    .refine((v) => {
      const n = Number(v);
      return n >= 2000 && n <= 2100;
    }, 'Năm không hợp lệ'),
  amount_limit: z
    .string()
    .min(1, 'Vui lòng nhập số tiền')
    .refine((v) => !Number.isNaN(Number(v)), { message: 'Số tiền không hợp lệ' })
    .refine((v) => Number(v) > 0, { message: 'Số tiền phải lớn hơn 0' }),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export function getDefaultBudgetFormValues(): BudgetFormValues {
  const now = new Date();
  return {
    category_id: '',
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    amount_limit: '',
  };
}

export { currentYear };
