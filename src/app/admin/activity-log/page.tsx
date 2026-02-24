'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import { Activity } from 'lucide-react';

export default function ActivityLogPage() {
  const { page, setPage } = usePagination(20);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-activity-log', page],
    queryFn: () => adminApi.getActivityLog({ page, limit: 20 }),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Log" description="Admin actions audit trail" />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <>
          <div className="space-y-2">
            {data?.data?.map((log: any) => (
              <Card key={log.id} className="card-premium">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{log.actionDescription}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{log.admin?.fullName}</span><span>•</span>
                        <span>{log.actionType?.replace(/_/g, ' ')}</span><span>•</span>
                        <span>{formatDateTime(log.createdAt)}</span>
                      </div>
                      {log.targetName && <p className="text-xs text-muted-foreground mt-0.5">Target: {log.targetName}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}