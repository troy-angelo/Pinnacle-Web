import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/earnings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/earnings"!</div>
}
