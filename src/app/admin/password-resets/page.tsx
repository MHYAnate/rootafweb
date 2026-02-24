'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { KeyRound, Loader2 } from 'lucide-react';

export default function PasswordResetsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-password-resets'],
    queryFn: () => adminApi.getPendingResets(),
  });

  const [tempPassword, setTempPassword] = useState('');
  const { mutate: processReset, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.processReset(id, data),
    onSuccess: () => { toast.success('Password reset processed'); qc.invalidateQueries({ queryKey: ['admin-password-resets'] }); setTempPassword(''); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Password Resets" description="Process pending password reset requests" />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
        <EmptyState icon={KeyRound} title="No pending resets" description="All password reset requests have been processed" />
      ) : (
        <div className="space-y-4">
          {data?.data?.map((req: any) => (
            <Card key={req.id} className="card-premium">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{req.user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{formatPhoneNumber(req.phoneNumber)} • {formatDate(req.createdAt)}</p>
                  {req.requestReason && <p className="text-xs text-muted-foreground mt-1">Reason: {req.requestReason}</p>}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-premium rounded-xl gap-2"><KeyRound className="h-4 w-4" />Process</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader><DialogTitle>Reset Password for {req.user?.fullName}</DialogTitle></DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Temporary Password *</Label>
                        <Input className="h-11 rounded-lg" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} placeholder="Enter temporary password" />
                      </div>
                      <Button className="w-full btn-premium rounded-xl" disabled={!tempPassword || isPending}
                        onClick={() => processReset({ id: req.id, data: { temporaryPassword: tempPassword } })}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Reset Password
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}