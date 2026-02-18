import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

export function SidebarAccount() {
  const name = 'John Smith';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const onLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-muted-foreground text-xs">Account</span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
