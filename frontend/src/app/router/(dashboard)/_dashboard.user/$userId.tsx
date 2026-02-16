import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(dashboard)/_dashboard/user/$userId')({
  component: RouteComponent
});

function RouteComponent() {
  const { userId } = Route.useParams();
  console.log('🚀 ~ RouteComponent ~ userId:', userId);
  return (
    <div>
      <p>{userId}</p>
    </div>
  );
}
