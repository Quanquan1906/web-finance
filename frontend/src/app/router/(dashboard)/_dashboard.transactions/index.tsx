import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/_dashboard/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/_dashboard/transactions/"!</div>
}
