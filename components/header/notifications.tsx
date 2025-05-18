'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const notificationText = (type: 'comment' | 'reply') => {
  if (type === 'comment') return 'commented on your tweak!';
  if (type === 'reply') return 'replied to you!';
};

export function Notifications({
  preloadedNotifications,
}: {
  preloadedNotifications: Preloaded<typeof api.notifications.getNotifications>;
}) {
  const notifications = usePreloadedQuery(preloadedNotifications);

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  if (notifications?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} className="relative" size={'icon'}>
            {notifications && notifications.length > 0 && (
              <span className="absolute -right-1 -top-2 rounded-full bg-red-500 px-1 text-xs text-white">
                {notifications.length}
              </span>
            )}
            <Bell />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[400px] overflow-y-auto">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications?.map((notification) => (
            <DropdownMenuItem key={notification._id}>
              <Link
                href={`/cT/${notification.city}/${notification.tweakId}`}
                className="flex flex-col"
                onClick={() => markAsRead({ notificationId: notification._id })}
              >
                <div className="flex items-center gap-1">
                  {notification.type === 'comment' ? '🗣️' : '💬'}
                  <p className="font-semibold">New {notification.type}</p>
                </div>
                <p>
                  {notification.sender?.username}{' '}
                  {notificationText(notification.type)}
                </p>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Button
            variant={'link'}
            className="w-full text-sm text-muted-foreground"
            onClick={() =>
              markAllAsRead({
                notificationIds: notifications.map((n) => n._id),
              })
            }
          >
            Mark all as read
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} className="relative" size={'icon'}>
            <Bell />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
