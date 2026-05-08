import { z } from "zod";

export const transactionFormSchema = z.object({
  category_id: z.string().min(1, "Vui lòng chọn danh mục"),
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Số tiền không hợp lệ",
    })
    .refine((value) => Number(value) > 0, {
      message: "Số tiền phải lớn hơn 0",
    }),
  type: z.enum(["income", "expense"]),
  transaction_date: z.string().min(1, "Vui lòng chọn ngày"),
  note: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;