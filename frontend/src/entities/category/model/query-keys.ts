export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: (kind?: string) => [...categoryQueryKeys.all, "list", kind] as const,
};