import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/sidebar/ui/AppSidebar";
import { NotificationBell } from "@/widgets/notifications";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1">
          <div className="sticky top-0 z-10 flex h-12 items-center border-b bg-background px-3">
            {/* Left */}
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="text-sm text-muted-foreground">Home</div>
            </div>

            {/* Right */}
            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
            </div>
          </div>

          <div className="p-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
