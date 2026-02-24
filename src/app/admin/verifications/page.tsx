
'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { Eye, Clock } from 'lucide-react';
import Link from 'next/link';

export default function VerificationsPage() {
  const { page, setPage } = usePagination();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-verifications', page],
    queryFn: () => adminApi.getPendingVerifications({ page, limit: 12 }),
  });

  return (
    <div>
      <PageHeader
        title="Pending Verifications"
        description="Review and verify user registrations"
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : data?.data?.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold">No pending verifications</h3>
            <p className="text-muted-foreground">All users have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data?.map((user: any) => (
              <Card key={user.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {user.fullName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{user.phoneNumber}</span>
                        <span>•</span>
                        <span>{user.userType}</span>
                        {user.memberProfile && (
                          <>
                            <span>•</span>
                            <span>{PROVIDER_TYPE_MAP[user.memberProfile.providerType]}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>Submitted: {formatDate(user.verificationSubmittedAt)}</span>
                        {user.resubmissionCount > 0 && (
                          <span className="text-orange-600">
                            (Resubmitted {user.resubmissionCount}x)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={user.verificationStatus} />
                    <span className="text-xs text-muted-foreground">
                      {user.verificationDocuments?.length || 0} docs
                    </span>
                    <Link href={`/admin/verifications/${user.id}`}>
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.meta && (
            <PaginationControls meta={data.meta} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}