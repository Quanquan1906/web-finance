import { AnalyticsPage } from '@/pages/analytics';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(dashboard)/_dashboard/analytics')({
  component: AnalyticsPage,
});
