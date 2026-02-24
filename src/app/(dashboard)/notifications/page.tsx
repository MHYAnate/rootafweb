'use client';

import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/use-notifications';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllAsRead();

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" action={
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => markAllRead()}>
          <CheckCheck className="h-4 w-4" />Mark All Read
        </Button>
      } />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {data?.data?.map((notif: any) => (
            <Card key={notif.id} className={cn('card-premium cursor-pointer', notif.status === 'UNREAD' && 'border-l-4 border-l-primary bg-primary/[0.02]')}
              onClick={() => notif.status === 'UNREAD' && markRead(notif.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">{notif.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{formatRelativeTime(notif.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}