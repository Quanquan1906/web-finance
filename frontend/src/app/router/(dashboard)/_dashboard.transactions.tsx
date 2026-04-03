import { createFileRoute } from "@tanstack/react-router";
import { TransactionsPage } from "@/pages/transactions";

export const Route = createFileRoute("/(dashboard)/_dashboard/transactions")({
  component: TransactionsRoute,
});

function TransactionsRoute() {
  return <TransactionsPage />;
}