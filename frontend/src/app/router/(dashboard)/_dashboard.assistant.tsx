import { AssistantPage } from '@/pages/assistant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(dashboard)/_dashboard/assistant')({
  component: AssistantPage,
});
