'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { CheckCircle, XCircle, RotateCcw, Loader2, ExternalLink } from 'lucide-react';

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

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-verifications'] });
    router.push('/admin/verifications');
  };

  const approveMutation = useMutation({ mutationFn: () => adminApi.approveUser(id as string), onSuccess: () => { toast.success('User approved!'); invalidate(); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed') });
  const rejectMutation = useMutation({ mutationFn: () => adminApi.rejectUser(id as string, { reason: rejectReason, details: rejectDetails }), onSuccess: () => { toast.success('User rejected'); invalidate(); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed') });
  const resubMutation = useMutation({ mutationFn: () => adminApi.requestResubmission(id as string, { reason: resubReason }), onSuccess: () => { toast.success('Resubmission requested'); invalidate(); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed') });

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  const user = data?.data;
  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <BackButton href="/admin/verifications" />
      <PageHeader title={`Verify: ${user.fullName}`} />

      <Card className="card-premium">
        <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Name:</span> <strong>{user.fullName}</strong></div>
          <div><span className="text-muted-foreground">Phone:</span> <strong>{formatPhoneNumber(user.phoneNumber)}</strong></div>
          <div><span className="text-muted-foreground">Email:</span> <strong>{user.email || 'N/A'}</strong></div>
          <div><span className="text-muted-foreground">Type:</span> <strong>{user.userType}</strong></div>
          <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={user.verificationStatus} /></div>
          <div><span className="text-muted-foreground">Submitted:</span> <strong>{formatDate(user.verificationSubmittedAt)}</strong></div>
          {user.memberProfile && <>
            <div><span className="text-muted-foreground">Provider Type:</span> <strong>{PROVIDER_TYPE_MAP[user.memberProfile.providerType]?.label}</strong></div>
            <div><span className="text-muted-foreground">Address:</span> <strong>{user.memberProfile.address}</strong></div>
            <div><span className="text-muted-foreground">State:</span> <strong>{user.memberProfile.state}</strong></div>
            <div><span className="text-muted-foreground">LGA:</span> <strong>{user.memberProfile.localGovernmentArea}</strong></div>
          </>}
        </CardContent>
      </Card>

      {user.verificationDocuments?.length > 0 && (
        <Card className="card-premium">
          <CardHeader><CardTitle>Documents ({user.verificationDocuments.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.verificationDocuments.map((doc: any) => (
                <div key={doc.id} className="border rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium">{doc.documentType.replace(/_/g, ' ')}</p>
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />View Document</a>
                  <StatusBadge status={doc.verificationStatus} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-premium">
        <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2">
              {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}Approve
            </Button>
            <Button variant="destructive" className="rounded-xl gap-2" onClick={() => setShowRejectForm(!showRejectForm)}>
              <XCircle className="h-4 w-4" />Reject
            </Button>
            <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowResubForm(!showResubForm)}>
              <RotateCcw className="h-4 w-4" />Request Resubmission
            </Button>
          </div>

          {showRejectForm && (
            <div className="border rounded-xl p-4 space-y-3 animate-fade-in">
              <Label>Rejection Reason *</Label>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="rounded-lg" />
              <Label>Details *</Label>
              <Textarea value={rejectDetails} onChange={(e) => setRejectDetails(e.target.value)} className="rounded-lg" />
              <Button variant="destructive" className="rounded-xl" onClick={() => rejectMutation.mutate()} disabled={!rejectReason || !rejectDetails || rejectMutation.isPending}>
                {rejectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm Rejection
              </Button>
            </div>
          )}

          {showResubForm && (
            <div className="border rounded-xl p-4 space-y-3 animate-fade-in">
              <Label>Resubmission Reason *</Label>
              <Textarea value={resubReason} onChange={(e) => setResubReason(e.target.value)} className="rounded-lg" />
              <Button className="rounded-xl btn-premium" onClick={() => resubMutation.mutate()} disabled={!resubReason || resubMutation.isPending}>
                {resubMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}