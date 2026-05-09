import { cn } from '@/shared/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/shared/ui/sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import { TrendingUp } from 'lucide-react';
import { financeManageItems } from '../model/menu-items';
import { SidebarAccount } from './SidebarAccount';

function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div
      className={cn('flex items-center gap-2.5 px-3 py-2', isCollapsed && 'justify-center px-2')}
    >
      <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm">
        <TrendingUp className="h-4 w-4" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-foreground text-sm font-semibold">FinTrack</span>
          <span className="text-muted-foreground text-[10px]">AI Finance</span>
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border border-b py-3">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 px-3 text-[10px] font-semibold tracking-widest uppercase">
            Quản lý
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeManageItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.url === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        'group/item relative transition-colors duration-150',
                        isActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-sidebar-accent/60'
                      )}
                    >
                      <Link to={item.url as any}>
                        {isActive && (
                          <span className="bg-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full" />
                        )}
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover/item:text-foreground'
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-sidebar-border border-t p-2">
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  );
}
