'use client';

import { useParams } from 'next/navigation';
import { useTool } from '@/hooks/use-tools';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Hammer, MapPin, Phone, Tag } from 'lucide-react';
import { TOOL_CONDITION_MAP, TOOL_PURPOSE_MAP } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ToolDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useTool(id as string);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Tool not found" />;

  const tool = data.data;
  const images = tool.images || [];
  const member = tool.member;
  const condInfo = TOOL_CONDITION_MAP[tool.condition];

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Tools" href="/tools" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden border relative">
            {images[selectedImage]?.imageUrl ? (
              <Image src={images[selectedImage].imageUrl} alt={tool.name} fill className="object-contain" />
            ) : (
              <div className="flex items-center justify-center h-full"><Hammer className="h-20 w-20 text-muted-foreground/20" /></div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img: any, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img.thumbnailUrl || img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${condInfo?.color || ''}`}>{condInfo?.label}</span>
              <Badge variant="outline" className="rounded-lg">{TOOL_PURPOSE_MAP[tool.listingPurpose]}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{tool.name}</h1>
          </div>

          <Separator />

          <div className="space-y-3">
            {(tool.listingPurpose === 'FOR_SALE' || tool.listingPurpose === 'BOTH') && tool.salePrice && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Sale Price</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(Number(tool.salePrice))}</p>
              </div>
            )}
            {(tool.listingPurpose === 'FOR_LEASE' || tool.listingPurpose === 'BOTH') && tool.leaseRate && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-muted-foreground mb-1">Lease Rate</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(Number(tool.leaseRate))}/{tool.leaseRatePeriod?.replace('PER_', '').toLowerCase()}
                </p>
                {tool.depositAmount && <p className="text-sm text-muted-foreground mt-1">Deposit: {formatCurrency(Number(tool.depositAmount))}</p>}
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {tool.brandName && <div className="flex justify-between"><span className="text-muted-foreground">Brand</span><span className="font-medium">{tool.brandName}</span></div>}
            {tool.modelNumber && <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="font-medium">{tool.modelNumber}</span></div>}
            {tool.yearManufactured && <div className="flex justify-between"><span className="text-muted-foreground">Year</span><span className="font-medium">{tool.yearManufactured}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{tool.quantityAvailable}</span></div>
          </div>

          {member && (
            <Card className="card-gold">
              <CardContent className="p-4">
                <Link href={`/members/${member.id}`} className="flex items-center gap-3 group">
                  <PremiumAvatar src={member.profilePhotoThumbnail} name={member.user?.fullName || ''} size="md" verified />
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">{member.user?.fullName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{member.state}</p>
                  </div>
                </Link>
                <Button className="w-full mt-4 btn-premium rounded-xl gap-2"><Phone className="h-4 w-4" />Contact Owner</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-12">
        <Card className="card-premium">
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tool.description}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}