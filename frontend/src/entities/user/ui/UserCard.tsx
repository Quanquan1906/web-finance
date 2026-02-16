import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { User } from '../model/types';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => (
  <Card
    className={cn('cursor-pointer hover:bg-accent transition-colors', className)}
    onClick={onClick}
  >
    <CardContent className="flex items-center gap-4 p-4">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </CardContent>
  </Card>
);