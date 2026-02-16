import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(dashboard)/_dashboard')({
  component: () => (
    <div className="flex h-screen w-full">
      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
});
