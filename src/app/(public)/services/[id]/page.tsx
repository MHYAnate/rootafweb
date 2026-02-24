'use client';

import { useParams } from 'next/navigation';
import { useService } from '@/hooks/use-services';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PriceDisplay } from '@/components/shared/price-display';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wrench, MapPin, Phone, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useService(id as string);

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Service not found" />;

  const service = data.data;
  const member = service.member;

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Services" href="/services" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{service.category?.name}</p>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <Badge variant="outline" className="mt-2 rounded-lg">{service.availability}</Badge>
          </div>

          <Separator />

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <PriceDisplay pricingType={service.pricingType} amount={service.startingPrice ? Number(service.startingPrice) : null}
              displayText={service.priceDisplayText} className="text-2xl font-bold text-primary" showBadge />
            {service.priceBasis && <p className="text-sm text-muted-foreground mt-1">{service.priceBasis}</p>}
          </div>

          <Card className="card-premium">
            <CardHeader><CardTitle>About This Service</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.description}</p>
            </CardContent>
          </Card>

          {service.serviceArea && (
            <Card className="card-premium">
              <CardHeader><CardTitle>Service Area</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.serviceArea}</p>
                {service.workingDays?.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {service.workingDays.join(', ')}
                    {service.workingHoursStart && ` (${service.workingHoursStart} - ${service.workingHoursEnd})`}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Image Gallery */}
          {service.images?.length > 0 && (
            <Card className="card-premium">
              <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.images.map((img: any, idx: number) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                      <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {member && (
            <Card className="card-gold sticky top-24">
              <CardContent className="p-5">
                <Link href={`/members/${member.id}`} className="flex items-center gap-3 group">
                  <PremiumAvatar src={member.profilePhotoThumbnail} name={member.user?.fullName || ''} size="md" verified />
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">{member.user?.fullName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{member.state}</p>
                  </div>
                </Link>
                <Button className="w-full mt-4 btn-premium rounded-xl gap-2"><Phone className="h-4 w-4" />Contact Provider</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}