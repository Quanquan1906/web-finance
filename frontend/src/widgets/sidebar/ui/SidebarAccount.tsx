import { LogOut, ChevronUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { useSidebar } from '@/shared/ui/sidebar';
import { useAuthStore } from '@/features/auth/model/store'; // đúng path của bạn
import { cn } from '@/shared/lib/utils';

export function SidebarAccount() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const name = user?.name ?? user?.email ?? 'Guest';
  const email = user?.email ?? '';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const onLogout = async () => {
    await logout();
    navigate({ to: '/login', replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-auto w-full gap-3 px-2 py-2 transition-colors hover:bg-sidebar-accent',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                <span className="max-w-full truncate text-sm font-semibold text-foreground">{name}</span>
                <span className="max-w-full truncate text-[11px] text-muted-foreground">{email || 'Account'}</span>
              </div>
              <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{name}</p>
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
