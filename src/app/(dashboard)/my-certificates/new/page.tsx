'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCertificate } from '@/hooks/use-certificates';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { ImageUpload } from '@/components/shared/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';

export default function NewCertificatePage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateCertificate();
  const [form, setForm] = useState({ certificateName: '', certificateType: '', issuingOrganization: '', dateIssued: '', certificatePhotoUrl: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, { onSuccess: () => router.push('/my-certificates') });
  };

  return (
    <div className="space-y-6">
      <BackButton href="/my-certificates" />
      <PageHeader title="Upload Certificate" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="card-premium"><CardHeader><CardTitle>Certificate Photo</CardTitle></CardHeader>
          <CardContent><ImageUpload folder="certificates" onUploadComplete={(r) => setForm({ ...form, certificatePhotoUrl: r.imageUrl })} label="Upload a clear photo of your certificate" /></CardContent>
        </Card>
        <Card className="card-premium"><CardHeader><CardTitle>Certificate Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Certificate Name *</Label><Input className="h-11 rounded-lg" value={form.certificateName} onChange={(e) => setForm({ ...form, certificateName: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Type *</Label>
              <Select value={form.certificateType} onValueChange={(v) => setForm({ ...form, certificateType: v })}>
                <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {['TRAINING_COMPLETION','PROFESSIONAL_CERTIFICATION','TRADE_LICENSE','AWARD_RECOGNITION','MEMBERSHIP_CERTIFICATE','SKILL_CERTIFICATION','OTHER'].map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Issuing Organization *</Label><Input className="h-11 rounded-lg" value={form.issuingOrganization} onChange={(e) => setForm({ ...form, issuingOrganization: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Date Issued *</Label><Input type="date" className="h-11 rounded-lg" value={form.dateIssued} onChange={(e) => setForm({ ...form, dateIssued: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Description (Optional)</Label><Textarea className="rounded-lg" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </CardContent>
        </Card>
        <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending || !form.certificatePhotoUrl}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Upload Certificate
        </Button>
      </form>
    </div>
  );
}