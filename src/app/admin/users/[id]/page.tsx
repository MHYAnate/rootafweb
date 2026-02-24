'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { Ban, RefreshCw, Loader2 } from 'lucide-react';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUserById(id as string),
    enabled: !!id,
  });

  const suspendMutation = useMutation({
    mutationFn: () => adminApi.suspendUser(id as string, 'Admin action'),
    onSuccess: () => { toast.success('User suspended'); qc.invalidateQueries({ queryKey: ['admin-user', id] }); },
  });

  const reactivateMutation = useMutation({
    mutationFn: () => adminApi.reactivateUser(id as string),
    onSuccess: () => { toast.success('User reactivated'); qc.invalidateQueries({ queryKey: ['admin-user', id] }); },
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  const user = data?.data;
  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <BackButton href="/admin/users" />
      <PageHeader title={user.fullName} />

      <Card className="card-gold">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <PremiumAvatar name={user.fullName} size="xl" verified={user.verificationStatus === 'VERIFIED'} />
            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> {formatPhoneNumber(user.phoneNumber)}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Type:</strong> {user.userType}</p>
              <p><strong>Status:</strong> <StatusBadge status={user.verificationStatus} /></p>
              <p><strong>Joined:</strong> {formatDate(user.createdAt)}</p>
              <p><strong>Last Login:</strong> {formatDate(user.lastLoginAt)}</p>
              <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium">
        <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          {user.isActive ? (
            <Button variant="destructive" className="rounded-xl gap-2" onClick={() => suspendMutation.mutate()} disabled={suspendMutation.isPending}>
              {suspendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}Suspend User
            </Button>
          ) : (
            <Button className="btn-premium rounded-xl gap-2" onClick={() => reactivateMutation.mutate()} disabled={reactivateMutation.isPending}>
              {reactivateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Reactivate User
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}