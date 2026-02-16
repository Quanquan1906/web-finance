import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/_auth')({
  component: () => (
    <div className="flex h-screen max-h-full flex-wrap bg-slate-100">
      <div className="hidden w-[70%] md:block"></div>
      <div className="mx-auto my-10">
        <Outlet />
      </div>
    </div>
  )
});
