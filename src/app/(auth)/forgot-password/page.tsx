'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth.api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.requestPasswordReset,
    onSuccess: () => { setSubmitted(true); toast.success('Request submitted!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (submitted) {
    return (
      <Card className="card-premium border-0 shadow-xl text-center animate-scale-in">
        <CardContent className="p-8 space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto"><CheckCircle className="h-8 w-8 text-emerald-500" /></div>
          <h2 className="text-xl font-bold">Request Submitted</h2>
          <p className="text-muted-foreground">An admin will process your password reset. You'll be contacted with a temporary password.</p>
          <Link href="/login"><Button variant="outline" className="rounded-xl gap-2"><ArrowLeft className="h-4 w-4" />Back to Login</Button></Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-premium border-0 shadow-xl animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Submit a request and an admin will assist you</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutate({ phoneNumber: phone, reason }); }} className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" />Phone Number *</Label>
            <Input placeholder="08012345678" className="h-11 rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea placeholder="Why do you need a reset?" className="rounded-lg" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button type="submit" className="w-full h-11 rounded-lg btn-premium" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit Request
          </Button>
        </form>
        <div className="mt-4 text-center"><Link href="/login" className="text-sm text-primary hover:underline">← Back to Login</Link></div>
      </CardContent>
    </Card>
  );
}