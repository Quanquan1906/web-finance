import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/pages/categories";

export const Route = createFileRoute("/(dashboard)/_dashboard/categories")({
  component: CategoriesPage,
});