import { createFileRoute } from '@tanstack/react-router';
import { BudgetsPage } from '@/pages/budgets';

export const Route = createFileRoute('/(dashboard)/_dashboard/budgets')({
  component: BudgetsPage,
});
