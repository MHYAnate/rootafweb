// 'use client';

// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { adminApi } from '@/lib/api/admin.api';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { formatDate, formatPhoneNumber } from '@/lib/format';
// import { KeyRound, Loader2 } from 'lucide-react';

// export default function PasswordResetsPage() {
//   const qc = useQueryClient();
//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-password-resets'],
//     queryFn: () => adminApi.getPendingResets(),
//   });

//   const [tempPassword, setTempPassword] = useState('');
//   const { mutate: processReset, isPending } = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.processReset(id, data),
//     onSuccess: () => { toast.success('Password reset processed'); qc.invalidateQueries({ queryKey: ['admin-password-resets'] }); setTempPassword(''); },
//     onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
//   });

//   return (
//     <div className="space-y-6">
//       <PageHeader title="Password Resets" description="Process pending password reset requests" />
//       {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
//         <EmptyState icon={KeyRound} title="No pending resets" description="All password reset requests have been processed" />
//       ) : (
//         <div className="space-y-4">
//           {data?.data?.map((req: any) => (
//             <Card key={req.id} className="card-premium">
//               <CardContent className="p-4 flex items-center justify-between">
//                 <div>
//                   <p className="font-semibold">{req.user?.fullName}</p>
//                   <p className="text-sm text-muted-foreground">{formatPhoneNumber(req.phoneNumber)} • {formatDate(req.createdAt)}</p>
//                   {req.requestReason && <p className="text-xs text-muted-foreground mt-1">Reason: {req.requestReason}</p>}
//                 </div>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button className="btn-premium rounded-xl gap-2"><KeyRound className="h-4 w-4" />Process</Button>
//                   </DialogTrigger>
//                   <DialogContent className="rounded-2xl">
//                     <DialogHeader><DialogTitle>Reset Password for {req.user?.fullName}</DialogTitle></DialogHeader>
//                     <div className="space-y-4 mt-4">
//                       <div className="space-y-2">
//                         <Label>Temporary Password *</Label>
//                         <Input className="h-11 rounded-lg" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} placeholder="Enter temporary password" />
//                       </div>
//                       <Button className="w-full btn-premium rounded-xl" disabled={!tempPassword || isPending}
//                         onClick={() => processReset({ id: req.id, data: { temporaryPassword: tempPassword } })}>
//                         {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Reset Password
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { usePendingPasswordResets, useProcessPasswordReset } from '@/hooks/use-admin';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { KeyRound, Loader2, Clock, CheckCircle } from 'lucide-react';

export default function AdminPasswordResetsPage() {
  const { page, setPage } = usePagination();
  const { data, isLoading } = usePendingPasswordResets({ page, limit: 20 });
  const processReset = useProcessPasswordReset();
  
  const [selectedReset, setSelectedReset] = useState<any>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [notes, setNotes] = useState('');

  const handleProcess = () => {
    if (!selectedReset || !tempPassword) return;
    processReset.mutate(
      { id: selectedReset.id, temporaryPassword: tempPassword, notes },
      {
        onSuccess: () => {
          setSelectedReset(null);
          setTempPassword('');
          setNotes('');
        },
      },
    );
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(password);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Password Reset Requests"
        description="Process user password reset requests"
        badge="Security"
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={KeyRound}
          title="No pending password resets"
          description="All requests have been processed"
        />
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((reset: any) => (
              <Card key={reset.id} className="rounded-2xl border-border/50 overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-orange-400 to-orange-500" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                        <KeyRound className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{reset.user?.fullName || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPhoneNumber(reset.phoneNumber)} • Submitted {formatDate(reset.createdAt)}
                        </p>
                        {reset.requestReason && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            "{reset.requestReason}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                        {reset.status}
                      </span>
                      <Button
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
                        onClick={() => {
                          setSelectedReset(reset);
                          generatePassword();
                        }}
                      >
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                        Process
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}

      {/* Process Dialog */}
      <Dialog open={!!selectedReset} onOpenChange={() => setSelectedReset(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Process Password Reset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-xl text-sm">
              <p><strong>User:</strong> {selectedReset?.user?.fullName}</p>
              <p><strong>Phone:</strong> {formatPhoneNumber(selectedReset?.phoneNumber || '')}</p>
            </div>
            <div className="space-y-2">
              <Label>Temporary Password *</Label>
              <div className="flex gap-2">
                <Input
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="rounded-xl h-11 font-mono"
                />
                <Button type="button" variant="outline" className="rounded-xl" onClick={generatePassword}>
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">User must change this on next login</p>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes..."
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReset(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleProcess}
              disabled={!tempPassword || processReset.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {processReset.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}