
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { CheckCircle, XCircle, RotateCcw, Loader2 } from 'lucide-react';

export default function VerificationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDetails, setRejectDetails] = useState('');
  const [resubReason, setResubReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showResubForm, setShowResubForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['verification-detail', id],
    queryFn: () => adminApi.getVerificationDetail(id as string),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => adminApi.approveUser(id as string),
    onSuccess: () => {
      toast.success('User approved!');
      qc.invalidateQueries({ queryKey: ['admin-verifications'] });
      router.push('/admin/verifications');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectUser(id as string, { reason: rejectReason, details: rejectDetails }),
    onSuccess: () => {
      toast.success('User rejected');
      qc.invalidateQueries({ queryKey: ['admin-verifications'] });
      router.push('/admin/verifications');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const resubMutation = useMutation({
    mutationFn: () => adminApi.requestResubmission(id as string, { reason: resubReason }),
    onSuccess: () => {
      toast.success('Resubmission requested');
      qc.invalidateQueries({ queryKey: ['admin-verifications'] });
      router.push('/admin/verifications');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const user = data?.data;
  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Verify: ${user.fullName}`} />

      {/* User Info */}
      <Card>
        <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Name:</span> <strong>{user.fullName}</strong></div>
          <div><span className="text-muted-foreground">Phone:</span> <strong>{formatPhoneNumber(user.phoneNumber)}</strong></div>
          <div><span className="text-muted-foreground">Email:</span> <strong>{user.email || 'N/A'}</strong></div>
          <div><span className="text-muted-foreground">Type:</span> <strong>{user.userType}</strong></div>
          <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={user.verificationStatus} /></div>
          <div><span className="text-muted-foreground">Submitted:</span> <strong>{formatDate(user.verificationSubmittedAt)}</strong></div>
          {user.memberProfile && (
            <>
              <div><span className="text-muted-foreground">Provider Type:</span> <strong>{PROVIDER_TYPE_MAP[user.memberProfile.providerType]}</strong></div>
              <div><span className="text-muted-foreground">Address:</span> <strong>{user.memberProfile.address}</strong></div>
              <div><span className="text-muted-foreground">State:</span> <strong>{user.memberProfile.state}</strong></div>
              <div><span className="text-muted-foreground">LGA:</span> <strong>{user.memberProfile.localGovernmentArea}</strong></div>
            </>
          )}
          {user.clientProfile && (
            <>
              <div><span className="text-muted-foreground">State:</span> <strong>{user.clientProfile.state || 'N/A'}</strong></div>
              <div>
                <span className="text-muted-foreground">NIN Photo:</span>{' '}
                {user.clientProfile.ninPhotoUrl ? (
                  <a href={user.clientProfile.ninPhotoUrl} target="_blank" className="text-primary underline">View NIN</a>
                ) : (
                  <strong>Not uploaded</strong>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      {user.verificationDocuments?.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Verification Documents</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.verificationDocuments.map((doc: any) => (
                <div key={doc.id} className="border rounded-lg p-3">
                  <p className="text-sm font-medium">{doc.documentType.replace(/_/g, ' ')}</p>
                  <a href={doc.fileUrl} target="_blank" className="text-primary text-sm underline">
                    View Document
                  </a>
                  <div className="mt-1">
                    <StatusBadge status={doc.verificationStatus} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Approve
            </Button>
            <Button variant="destructive" onClick={() => setShowRejectForm(!showRejectForm)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button variant="outline" onClick={() => setShowResubForm(!showResubForm)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Request Resubmission
            </Button>
          </div>

          {showRejectForm && (
            <div className="border rounded-lg p-4 space-y-3">
              <Label>Rejection Reason *</Label>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection" />
              <Label>Details *</Label>
              <Textarea value={rejectDetails} onChange={(e) => setRejectDetails(e.target.value)} placeholder="Detailed explanation" />
              <Button variant="destructive" onClick={() => rejectMutation.mutate()} disabled={!rejectReason || !rejectDetails || rejectMutation.isPending}>
                {rejectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Rejection
              </Button>
            </div>
          )}

          {showResubForm && (
            <div className="border rounded-lg p-4 space-y-3">
              <Label>Resubmission Reason *</Label>
              <Textarea value={resubReason} onChange={(e) => setResubReason(e.target.value)} placeholder="What needs to be resubmitted and why" />
              <Button onClick={() => resubMutation.mutate()} disabled={!resubReason || resubMutation.isPending}>
                {resubMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Resubmission Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}