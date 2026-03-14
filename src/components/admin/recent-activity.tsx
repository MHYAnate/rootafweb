'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatRelativeTime } from '@/lib/format';
import { Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  actionDescription: string;
  actionType: string;
  targetType?: string;
  targetName?: string;
  createdAt: string;
  admin: {
    fullName: string;
    username: string;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function RecentActivity({ activities, maxItems = 10 }: RecentActivityProps) {
  const items = activities.slice(0, maxItems);

  const getActionColor = (actionType: string) => {
    if (actionType.includes('APPROVED') || actionType.includes('CREATED') || actionType.includes('REACTIVATED')) {
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
    if (actionType.includes('REJECTED') || actionType.includes('SUSPENDED') || actionType.includes('DEACTIVATED') || actionType.includes('DELETED')) {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (actionType.includes('LOGIN') || actionType.includes('LOGOUT')) {
      return 'bg-royal-100 text-royal-700 border-royal-200';
    }
    if (actionType.includes('UPDATED') || actionType.includes('CHANGED')) {
      return 'bg-gold-100 text-gold-700 border-gold-200';
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
        </div>
        <Link href="/admin/activity-log">
          <Button variant="ghost" size="sm" className="rounded-xl text-xs">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium leading-snug">{item.actionDescription}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getActionColor(item.actionType)}`}>
                        {item.actionType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{item.admin?.fullName}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}