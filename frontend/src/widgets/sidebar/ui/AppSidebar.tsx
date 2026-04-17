import { Link, useRouterState } from '@tanstack/react-router';
import { SidebarAccount } from './SidebarAccount';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { financeManageItems } from '../model/menu-items';
import { cn } from '@/shared/lib/utils';

function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className={cn('flex items-center gap-2.5 px-3 py-2', isCollapsed && 'justify-center px-2')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <TrendingUp className="h-4 w-4" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">FinTrack</span>
          <span className="text-[10px] text-muted-foreground">AI Finance</span>
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
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

                if (item.children && item.children.length > 0) {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                              'transition-colors duration-150',
                              isActive && 'bg-accent text-accent-foreground font-medium'
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="py-1 pl-6">
                            {item.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildActive = pathname.startsWith(child.url);
                              return (
                                <SidebarMenuItem key={child.title}>
                                  <SidebarMenuButton
                                    asChild
                                    size="sm"
                                    className={cn(
                                      'transition-colors duration-150',
                                      isChildActive && 'bg-accent text-accent-foreground font-medium'
                                    )}
                                  >
                                    <Link to={child.url as any}>
                                      <ChildIcon className="h-3.5 w-3.5" />
                                      <span>{child.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

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
                          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                        )}
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground group-hover/item:text-foreground'
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
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  );
}
