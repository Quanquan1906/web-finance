export const CATEGORY_COLOR_OPTIONS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-green-600",
  "bg-pink-500",
] as const;

export type CategoryColorOption = (typeof CATEGORY_COLOR_OPTIONS)[number];