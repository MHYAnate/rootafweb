'use client';

import { usePendingVerifications, useVerificationStats } from '@/hooks/use-admin';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { VerificationCard } from '@/components/admin/verification-card';
import { StatsCards } from '@/components/admin/stats-cards';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, XCircle, RotateCcw, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminVerificationsPage() {
  const { page, setPage } = usePagination();
  const [tab, setTab] = useState<string>('all');

  const params: any = { page, limit: 12 };
  if (tab !== 'all') params.status = tab;

  const { data, isLoading } = usePendingVerifications(params);
  const { data: statsData } = useVerificationStats();
  const stats = statsData?.data;

  const statCards = [
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, gradient: 'from-gold-500 to-gold-600', alert: (stats?.pending || 0) > 0 },
    { label: 'Under Review', value: stats?.underReview || 0, icon: AlertCircle, gradient: 'from-royal-500 to-royal-600' },
    { label: 'Resubmitted', value: stats?.resubmitted || 0, icon: RotateCcw, gradient: 'from-orange-500 to-orange-600' },
    { label: 'Verified', value: stats?.verified || 0, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, gradient: 'from-red-500 to-red-600' },
    { label: 'Total', value: stats?.total || 0, icon: Users, gradient: 'from-primary to-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Verifications"
        description="Review and verify user registrations"
        badge="Verification Queue"
      />

      {/* Stats */}
      <StatsCards stats={statCards} />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1); }}>
        <TabsList className="rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">All Pending</TabsTrigger>
          <TabsTrigger value="PENDING" className="rounded-lg">New</TabsTrigger>
          <TabsTrigger value="RESUBMITTED" className="rounded-lg">Resubmitted</TabsTrigger>
          <TabsTrigger value="UNDER_REVIEW" className="rounded-lg">Under Review</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : !data?.data?.length ? (
            <EmptyState
              icon={CheckCircle}
              title="No pending verifications"
              description="All users have been reviewed. Great job!"
            />
          ) : (
            <>
              <div className="space-y-4">
                {data.data.map((user: any) => (
                  <VerificationCard key={user.id} user={user} />
                ))}
              </div>
              {data.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}