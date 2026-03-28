import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(50, "Tên danh mục tối đa 50 ký tự"),

  icon: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập icon")
    .max(10, "Icon không hợp lệ"),

  color: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn màu")
    .max(50, "Màu không hợp lệ"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const DEFAULT_CATEGORY_FORM_VALUES: CategoryFormValues = {
  name: "",
  icon: "",
  color: "bg-orange-500",
};