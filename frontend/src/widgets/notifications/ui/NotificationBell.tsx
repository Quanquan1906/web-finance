import { Bell } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

export function NotificationBell() {
  const notifications: Array<{ id: string; title: string }> = [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80">
        <div className="font-semibold mb-2">Thông báo mới</div>
        {notifications.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Không có thông báo
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="text-sm">
                {n.title}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
