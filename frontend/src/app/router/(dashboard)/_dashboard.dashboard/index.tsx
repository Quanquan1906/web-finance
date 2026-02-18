import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/_dashboard/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/_dashboard/dashboard/"!</div>
}
