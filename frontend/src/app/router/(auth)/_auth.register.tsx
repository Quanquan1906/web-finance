import { RegisterPage } from "@/pages/register";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/(auth)/_auth/register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  return <RegisterPage />;
}