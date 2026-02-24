'use client';

import { useMyCertificates, useDeleteCertificate } from '@/hooks/use-certificates';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { Award, Plus, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function MyCertificatesPage() {
  const { data, isLoading } = useMyCertificates();
  const { mutate: deleteCertificate } = useDeleteCertificate();

  return (
    <div className="space-y-6">
      <PageHeader title="My Certificates" action={<Link href="/my-certificates/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Upload Certificate</Button></Link>} />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet" description="Upload your certificates and qualifications"
          action={<Link href="/my-certificates/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Upload Certificate</Button></Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.data?.map((cert: any) => (
            <Card key={cert.id} className="card-premium">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                  {cert.certificateThumbnailUrl ? (
                    <img src={cert.certificateThumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><Award className="h-8 w-8 text-muted-foreground/30" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{cert.certificateName}</h4>
                  <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                  <p className="text-xs text-muted-foreground">Issued: {formatDate(cert.dateIssued)}</p>
                  <Badge variant="outline" className="rounded-lg mt-2 text-[10px]">{cert.verificationStatus}</Badge>
                </div>
                <ConfirmDialog trigger={<Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                  title="Remove Certificate" description="Are you sure?" onConfirm={() => deleteCertificate(cert.id)} confirmText="Remove" destructive />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}