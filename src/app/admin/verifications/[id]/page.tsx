// 'use client';

// import { useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { adminApi } from '@/lib/api/admin.api';
// import { BackButton } from '@/components/shared/back-button';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { StatusBadge } from '@/components/shared/status-badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { formatDate, formatPhoneNumber } from '@/lib/format';
// import { PROVIDER_TYPE_MAP } from '@/lib/constants';
// import { CheckCircle, XCircle, RotateCcw, Loader2, ExternalLink } from 'lucide-react';

// export default function VerificationDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const qc = useQueryClient();
//   const [rejectReason, setRejectReason] = useState('');
//   const [rejectDetails, setRejectDetails] = useState('');
//   const [resubReason, setResubReason] = useState('');
//   const [showRejectForm, setShowRejectForm] = useState(false);
//   const [showResubForm, setShowResubForm] = useState(false);

//   const { data, isLoading } = useQuery({
//     queryKey: ['verification-detail', id],
//     queryFn: () => adminApi.getVerificationDetail(id as string),
//     enabled: !!id,
//   });

//   const invalidate = () => {
//     qc.invalidateQueries({ queryKey: ['admin-verifications'] });
//     router.push('/admin/verifications');
//   };

//   const approveMutation = useMutation({ mutationFn: () => adminApi.approveUser(id as string), onSuccess: () => { toast.success('User approved!'); invalidate(); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed') });
//   const rejectMutation = useMutation({ mutationFn: () => adminApi.rejectUser(id as string, { reason: rejectReason, details: rejectDetails }), onSuccess: () => { toast.success('User rejected'); invalidate(); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed') });
//   const resubMutation = useMutation({ mutationFn: () => adminApi.requestResubmission(id as string, { reason: resubReason }), onSuccess: () => { toast.success('Resubmission requested'); invalidate(); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed') });

//   if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
//   const user = data?.data;
//   if (!user) return <div>User not found</div>;

//   return (
//     <div className="space-y-6">
//       <BackButton href="/admin/verifications" />
//       <PageHeader title={`Verify: ${user.fullName}`} />

//       <Card className="card-premium">
//         <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div><span className="text-muted-foreground">Name:</span> <strong>{user.fullName}</strong></div>
//           <div><span className="text-muted-foreground">Phone:</span> <strong>{formatPhoneNumber(user.phoneNumber)}</strong></div>
//           <div><span className="text-muted-foreground">Email:</span> <strong>{user.email || 'N/A'}</strong></div>
//           <div><span className="text-muted-foreground">Type:</span> <strong>{user.userType}</strong></div>
//           <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={user.verificationStatus} /></div>
//           <div><span className="text-muted-foreground">Submitted:</span> <strong>{formatDate(user.verificationSubmittedAt)}</strong></div>
//           {user.memberProfile && <>
//             <div><span className="text-muted-foreground">Provider Type:</span> <strong>{PROVIDER_TYPE_MAP[user.memberProfile.providerType]?.label}</strong></div>
//             <div><span className="text-muted-foreground">Address:</span> <strong>{user.memberProfile.address}</strong></div>
//             <div><span className="text-muted-foreground">State:</span> <strong>{user.memberProfile.state}</strong></div>
//             <div><span className="text-muted-foreground">LGA:</span> <strong>{user.memberProfile.localGovernmentArea}</strong></div>
//           </>}
//         </CardContent>
//       </Card>

//       {user.verificationDocuments?.length > 0 && (
//         <Card className="card-premium">
//           <CardHeader><CardTitle>Documents ({user.verificationDocuments.length})</CardTitle></CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {user.verificationDocuments.map((doc: any) => (
//                 <div key={doc.id} className="border rounded-xl p-4 space-y-2">
//                   <p className="text-sm font-medium">{doc.documentType.replace(/_/g, ' ')}</p>
//                   <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />View Document</a>
//                   <StatusBadge status={doc.verificationStatus} />
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <Card className="card-premium">
//         <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-wrap gap-3">
//             <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2">
//               {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}Approve
//             </Button>
//             <Button variant="destructive" className="rounded-xl gap-2" onClick={() => setShowRejectForm(!showRejectForm)}>
//               <XCircle className="h-4 w-4" />Reject
//             </Button>
//             <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowResubForm(!showResubForm)}>
//               <RotateCcw className="h-4 w-4" />Request Resubmission
//             </Button>
//           </div>

//           {showRejectForm && (
//             <div className="border rounded-xl p-4 space-y-3 animate-fade-in">
//               <Label>Rejection Reason *</Label>
//               <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="rounded-lg" />
//               <Label>Details *</Label>
//               <Textarea value={rejectDetails} onChange={(e) => setRejectDetails(e.target.value)} className="rounded-lg" />
//               <Button variant="destructive" className="rounded-xl" onClick={() => rejectMutation.mutate()} disabled={!rejectReason || !rejectDetails || rejectMutation.isPending}>
//                 {rejectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm Rejection
//               </Button>
//             </div>
//           )}

//           {showResubForm && (
//             <div className="border rounded-xl p-4 space-y-3 animate-fade-in">
//               <Label>Resubmission Reason *</Label>
//               <Textarea value={resubReason} onChange={(e) => setResubReason(e.target.value)} className="rounded-lg" />
//               <Button className="rounded-xl btn-premium" onClick={() => resubMutation.mutate()} disabled={!resubReason || resubMutation.isPending}>
//                 {resubMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send Request
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useVerificationDetail,
  useApproveUser,
  useRejectUser,
  useRequestResubmission,
  useStartReview,
} from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { BackButton } from '@/components/shared/back-button';
import { VerificationDocumentViewer } from '@/components/admin/verification-document-viewer';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import {
  CheckCircle, XCircle, RotateCcw, Loader2, MapPin, Phone,
  Mail, Calendar, User, Shield, FileText, AlertCircle,
} from 'lucide-react';

export default function VerificationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDetails, setRejectDetails] = useState('');
  const [resubReason, setResubReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showResubForm, setShowResubForm] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);

  const { data, isLoading } = useVerificationDetail(id as string);
  const startReview = useStartReview();
  const approve = useApproveUser();
  const reject = useRejectUser();
  const requestResub = useRequestResubmission();

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const user = data?.data;
  if (!user) return <div className="text-center py-20">User not found</div>;

  const handleApprove = () => {
    approve.mutate(
      { userId: id as string, notes: approveNotes },
      { onSuccess: () => router.push('/admin/verifications') },
    );
  };

  const handleReject = () => {
    reject.mutate(
      { userId: id as string, reason: rejectReason, details: rejectDetails },
      { onSuccess: () => router.push('/admin/verifications') },
    );
  };

  const handleResub = () => {
    requestResub.mutate(
      { userId: id as string, reason: resubReason },
      { onSuccess: () => router.push('/admin/verifications') },
    );
  };

  const handleStartReview = () => {
    startReview.mutate(id as string);
  };

  return (
    <div className="space-y-6">
      <BackButton href="/admin/verifications" label="Back to Verifications" />

      <PageHeader
        title={`Review: ${user.fullName}`}
        badge="Verification"
      />

      {/* User Information */}
      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-gold-400 to-royal-400" />
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <PremiumAvatar name={user.fullName} imageUrl={user.memberProfile?.profilePhotoUrl} size="xl" />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <InfoRow label="Full Name" value={user.fullName} />
              <InfoRow label="Phone" value={formatPhoneNumber(user.phoneNumber)} />
              <InfoRow label="Email" value={user.email || 'N/A'} />
              <InfoRow label="User Type" value={user.userType} />
              <InfoRow label="Status">
                <StatusBadge status={user.verificationStatus} />
              </InfoRow>
              <InfoRow label="Submitted" value={formatDate(user.verificationSubmittedAt || user.createdAt)} />

              {user.memberProfile && (
                <>
                  <InfoRow label="Provider Type" value={PROVIDER_TYPE_MAP[user.memberProfile.providerType] as any} />
                  <InfoRow label="Address" value={user.memberProfile.address} />
                  <InfoRow label="State" value={user.memberProfile.state} />
                  <InfoRow label="LGA" value={user.memberProfile.localGovernmentArea} />
                </>
              )}

              {user.clientProfile && (
                <>
                  <InfoRow label="State" value={user.clientProfile.state || 'N/A'} />
                  <InfoRow label="NIN Photo">
                    {user.clientProfile.ninPhotoUrl ? (
                      <a href={user.clientProfile.ninPhotoUrl} target="_blank" className="text-primary underline font-medium">
                        View NIN Photo
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Not uploaded</span>
                    )}
                  </InfoRow>
                </>
              )}

              {user.resubmissionCount > 0 && (
                <InfoRow label="Resubmissions">
                  <span className="text-orange-600 font-semibold">{user.resubmissionCount} time(s)</span>
                </InfoRow>
              )}

              {user.rejectionReason && (
                <div className="col-span-2 bg-red-50 p-3 rounded-xl border border-red-200">
                  <p className="text-xs font-semibold text-red-700 mb-1">Previous Rejection Reason</p>
                  <p className="text-sm text-red-600">{user.rejectionReason}</p>
                  {user.rejectionDetails && (
                    <p className="text-xs text-red-500 mt-1">{user.rejectionDetails}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Documents */}
      <VerificationDocumentViewer documents={user.verificationDocuments || []} />

      {/* Actions */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Verification Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Start Review button */}
          {user.verificationStatus === 'PENDING' && (
            <Button
              onClick={handleStartReview}
              disabled={startReview.isPending}
              variant="outline"
              className="rounded-xl"
            >
              {startReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <AlertCircle className="mr-2 h-4 w-4" />
              Start Review
            </Button>
          )}

          {/* Main action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowApproveForm(!showApproveForm)}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => { setShowRejectForm(!showRejectForm); setShowResubForm(false); setShowApproveForm(false); }}
              className="rounded-xl"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowResubForm(!showResubForm); setShowRejectForm(false); setShowApproveForm(false); }}
              className="rounded-xl"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Request Resubmission
            </Button>
          </div>

          {/* Approve Form */}
          {showApproveForm && (
            <div className="border rounded-xl p-5 space-y-3 bg-emerald-50/50 border-emerald-200">
              <Label>Approval Notes (Optional)</Label>
              <Textarea
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                placeholder="Any notes about this approval..."
                className="rounded-xl"
              />
              <Button
                onClick={handleApprove}
                disabled={approve.isPending}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                {approve.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Approval
              </Button>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="border rounded-xl p-5 space-y-3 bg-red-50/50 border-red-200">
              <Label>Rejection Reason *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Primary reason for rejection"
                className="rounded-xl"
              />
              <Label>Detailed Explanation *</Label>
              <Textarea
                value={rejectDetails}
                onChange={(e) => setRejectDetails(e.target.value)}
                placeholder="Provide detailed explanation..."
                className="rounded-xl"
                rows={4}
              />
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason || !rejectDetails || reject.isPending}
                className="rounded-xl"
              >
                {reject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Rejection
              </Button>
            </div>
          )}

          {/* Resubmission Form */}
          {showResubForm && (
            <div className="border rounded-xl p-5 space-y-3 bg-orange-50/50 border-orange-200">
              <Label>Resubmission Reason *</Label>
              <Textarea
                value={resubReason}
                onChange={(e) => setResubReason(e.target.value)}
                placeholder="What needs to be resubmitted and why..."
                className="rounded-xl"
                rows={4}
              />
              <Button
                onClick={handleResub}
                disabled={!resubReason || requestResub.isPending}
                className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
              >
                {requestResub.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Resubmission Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
      <div className="font-medium mt-0.5">{children || value || 'N/A'}</div>
    </div>
  );
}