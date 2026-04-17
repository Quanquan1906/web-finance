import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/sidebar/ui/AppSidebar";
import { NotificationBell } from "@/widgets/notifications";
import { useRouterState } from "@tanstack/react-router";
import { Separator } from "@/shared/ui/separator";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Giao dịch",
  "/categories": "Danh mục",
  "/analytics": "Thống kê",
  "/assistant": "AI Trợ lý",
  "/dashboard/settings": "Cài đặt",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const pageTitle =
    Object.entries(routeLabels).find(([route]) =>
      route === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route)
    )?.[1] ?? "Trang";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-semibold text-foreground">{pageTitle}</span>

            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-auto p-5 md:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
