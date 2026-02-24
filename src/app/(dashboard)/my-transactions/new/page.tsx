'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTransaction } from '@/hooks/use-transactions';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';

export default function NewTransactionPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateTransaction();
  const [form, setForm] = useState({
    transactionType: '', transactionDate: new Date().toISOString().split('T')[0],
    amount: '', clientName: '', clientPhone: '', listingName: '', notes: '',
  });

  return (
    <div className="space-y-6">
      <BackButton href="/my-transactions" />
      <PageHeader title="Record Transaction" />
      <form onSubmit={(e) => { e.preventDefault(); mutate({ ...form, amount: Number(form.amount) }, { onSuccess: () => router.push('/my-transactions') }); }} className="space-y-6">
        <Card className="card-premium"><CardHeader><CardTitle>Transaction Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Type *</Label>
              <Select value={form.transactionType} onValueChange={(v) => setForm({ ...form, transactionType: v })}>
                <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUCT_SALE">Product Sale</SelectItem>
                  <SelectItem value="SERVICE_RENDERED">Service Rendered</SelectItem>
                  <SelectItem value="TOOL_LEASE">Tool Lease</SelectItem>
                  <SelectItem value="TOOL_SALE">Tool Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date *</Label><Input type="date" className="h-11 rounded-lg" value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>Amount (₦) *</Label><Input type="number" className="h-11 rounded-lg" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label>Item/Service Name</Label><Input className="h-11 rounded-lg" value={form.listingName} onChange={(e) => setForm({ ...form, listingName: e.target.value })} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Client Name</Label><Input className="h-11 rounded-lg" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div>
              <div className="space-y-2"><Label>Client Phone</Label><Input className="h-11 rounded-lg" value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea className="rounded-lg" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </CardContent>
        </Card>
        <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending || !form.transactionType || !form.amount}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Record Transaction
        </Button>
      </form>
    </div>
  );
}