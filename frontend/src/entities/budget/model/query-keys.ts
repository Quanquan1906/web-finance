export const budgetQueryKeys = {
  all: ['budgets'] as const,
  list: (params?: { year?: number; month?: number }) =>
    [...budgetQueryKeys.all, 'list', params] as const,
  progress: (year: number, month: number) =>
    [...budgetQueryKeys.all, 'progress', year, month] as const,
};
