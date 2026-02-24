'use client';

import { useMyServices, useDeleteService } from '@/hooks/use-services';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MyServicesPage() {
  const { data, isLoading } = useMyServices();
  const { mutate: deleteService } = useDeleteService();

  return (
    <div className="space-y-6">
      <PageHeader title="My Services" action={<Link href="/my-services/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Add Service</Button></Link>} />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" action={<Link href="/my-services/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Add Service</Button></Link>} />
      ) : (
        <div className="space-y-4">
          {data?.data?.map((service: any) => (
            <Card key={service.id} className="card-premium">
              <CardContent className="p-4 flex items-center justify-between">
                <div><h3 className="font-semibold">{service.name}</h3><p className="text-xs text-muted-foreground">{service.category?.name}</p></div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-lg">{service.availability}</Badge>
                  <Link href={`/my-services/${service.id}/edit`}><Button variant="outline" size="icon" className="rounded-lg"><Edit className="h-4 w-4" /></Button></Link>
                  <ConfirmDialog trigger={<Button variant="outline" size="icon" className="rounded-lg text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                    title="Delete Service" description="Are you sure?" onConfirm={() => deleteService(service.id)} confirmText="Delete" destructive />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}