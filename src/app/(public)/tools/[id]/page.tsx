// 'use client';

// import { useParams } from 'next/navigation';
// import { useTool } from '@/hooks/use-tools';
// import { BackButton } from '@/components/shared/back-button';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { ErrorDisplay } from '@/components/shared/error-display';
// import { PremiumAvatar } from '@/components/shared/premium-avatar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Hammer, MapPin, Phone, Tag } from 'lucide-react';
// import { TOOL_CONDITION_MAP, TOOL_PURPOSE_MAP } from '@/lib/constants';
// import { formatCurrency } from '@/lib/format';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useState } from 'react';

// export default function ToolDetailPage() {
//   const { id } = useParams();
//   const { data, isLoading, error } = useTool(id as string);
//   const [selectedImage, setSelectedImage] = useState(0);

//   if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
//   if (error || !data?.data) return <ErrorDisplay message="Tool not found" />;

//   const tool = data.data;
//   const images = tool.images || [];
//   const member = tool.member;
//   const condInfo = TOOL_CONDITION_MAP[tool.condition];

//   return (
//     <div className="container-custom py-10">
//       <BackButton label="Back to Tools" href="/tools" />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         <div className="space-y-4">
//           <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden border relative">
//             {images[selectedImage]?.imageUrl ? (
//               <Image src={images[selectedImage].imageUrl} alt={tool.name} fill className="object-contain" />
//             ) : (
//               <div className="flex items-center justify-center h-full"><Hammer className="h-20 w-20 text-muted-foreground/20" /></div>
//             )}
//           </div>
//           {images.length > 1 && (
//             <div className="flex gap-2 overflow-x-auto">
//               {images.map((img: any, idx: number) => (
//                 <button key={idx} onClick={() => setSelectedImage(idx)}
//                   className={`h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}>
//                   <img src={img.thumbnailUrl || img.imageUrl} alt="" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${condInfo?.color || ''}`}>{condInfo?.label}</span>
//               <Badge variant="outline" className="rounded-lg">{TOOL_PURPOSE_MAP[tool.listingPurpose]}</Badge>
//             </div>
//             <h1 className="text-3xl font-bold">{tool.name}</h1>
//           </div>

//           <Separator />

//           <div className="space-y-3">
//             {(tool.listingPurpose === 'FOR_SALE' || tool.listingPurpose === 'BOTH') && tool.salePrice && (
//               <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
//                 <p className="text-xs text-muted-foreground mb-1">Sale Price</p>
//                 <p className="text-2xl font-bold text-primary">{formatCurrency(Number(tool.salePrice))}</p>
//               </div>
//             )}
//             {(tool.listingPurpose === 'FOR_LEASE' || tool.listingPurpose === 'BOTH') && tool.leaseRate && (
//               <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
//                 <p className="text-xs text-muted-foreground mb-1">Lease Rate</p>
//                 <p className="text-2xl font-bold text-blue-700">
//                   {formatCurrency(Number(tool.leaseRate))}/{tool.leaseRatePeriod?.replace('PER_', '').toLowerCase()}
//                 </p>
//                 {tool.depositAmount && <p className="text-sm text-muted-foreground mt-1">Deposit: {formatCurrency(Number(tool.depositAmount))}</p>}
//               </div>
//             )}
//           </div>

//           <div className="space-y-2 text-sm">
//             {tool.brandName && <div className="flex justify-between"><span className="text-muted-foreground">Brand</span><span className="font-medium">{tool.brandName}</span></div>}
//             {tool.modelNumber && <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="font-medium">{tool.modelNumber}</span></div>}
//             {tool.yearManufactured && <div className="flex justify-between"><span className="text-muted-foreground">Year</span><span className="font-medium">{tool.yearManufactured}</span></div>}
//             <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{tool.quantityAvailable}</span></div>
//           </div>

//           {member && (
//             <Card className="card-gold">
//               <CardContent className="p-4">
//                 <Link href={`/members/${member.id}`} className="flex items-center gap-3 group">
//                   <PremiumAvatar src={member.profilePhotoThumbnail} name={member.user?.fullName || ''} size="md" verified />
//                   <div>
//                     <p className="font-semibold group-hover:text-primary transition-colors">{member.user?.fullName}</p>
//                     <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{member.state}</p>
//                   </div>
//                 </Link>
//                 <Button className="w-full mt-4 btn-premium rounded-xl gap-2"><Phone className="h-4 w-4" />Contact Owner</Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       <div className="mt-12">
//         <Card className="card-premium">
//           <CardHeader><CardTitle>Description</CardTitle></CardHeader>
//           <CardContent><p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tool.description}</p></CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/tools/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTool, useTools } from '@/hooks/use-tools';
import { ToolImageGallery } from '@/components/tools/tool-image-gallery';
import { ToolContactCard } from '@/components/tools/tool-contact-card';
import { ToolCard } from '@/components/tools/tool-card';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Wrench,
  MapPin,
  Calendar,
  Eye,
  Package,
  Tag,
  Truck,
  ShieldCheck,
  Info,
  Star,
  Layers,
  Hash,
  CheckCircle2,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const conditionConfig: Record<string, { label: string; className: string; description: string }> = {
  NEW: {
    label: 'Brand New',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    description: 'Unused, in original packaging',
  },
  FAIRLY_USED: {
    label: 'Fairly Used',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'Used but in good working condition',
  },
  USED: {
    label: 'Used',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    description: 'Functional with visible wear',
  },
  REFURBISHED: {
    label: 'Refurbished',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    description: 'Restored to working condition',
  },
};

const purposeLabels: Record<string, string> = {
  SALE: 'For Sale',
  LEASE: 'For Lease',
  BOTH: 'For Sale & Lease',
};

function formatPrice(amount: number | null | undefined) {
  if (!amount) return null;
  return `₦${Number(amount).toLocaleString()}`;
}

export default function ToolDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError } = useTool(id as string);

  // Related tools: same category
  const tool = data?.data;
  const { data: relatedData } = useTools({
    categoryId: tool?.categoryId,
    limit: 4,
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  if (isError || !tool) {
    return (
      <div className="text-center py-20">
        <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
        <p className="text-muted-foreground mb-4">
          This tool may have been removed or doesn&apos;t exist.
        </p>
        <BackButton href="/tools" label="Back to Marketplace" />
      </div>
    );
  }

  const condition = conditionConfig[tool.condition] || conditionConfig.USED;
  const relatedTools = (relatedData?.data || []).filter((t: any) => t.id !== tool.id).slice(0, 3);

  return (
    <div className="space-y-6">
      <BackButton href="/tools" label="Back to Marketplace" />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <ToolImageGallery images={tool.images || []} toolName={tool.name} />

          {/* Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={condition.className}>{condition.label}</Badge>
              <Badge variant="outline">
                {purposeLabels[tool.listingPurpose] || tool.listingPurpose}
              </Badge>
              {tool.deliveryAvailable && (
                <Badge variant="secondary" className="gap-1">
                  <Truck className="h-3 w-3" /> Delivery Available
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
            {tool.category && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {tool.category.name}
              </p>
            )}
          </div>

          {/* Mobile Price Card */}
          <div className="lg:hidden">
            <ToolContactCard member={tool.member} tool={tool} />
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="card-premium">
              <CardContent className="p-3 text-center">
                <Package className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-semibold">{tool.quantityAvailable || 1}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Available</p>
              </CardContent>
            </Card>
            <Card className="card-premium">
              <CardContent className="p-3 text-center">
                <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-semibold">{tool.viewCount || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Views</p>
              </CardContent>
            </Card>
            <Card className="card-premium">
              <CardContent className="p-3 text-center">
                <ShieldCheck className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-semibold">{condition.label}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Condition</p>
              </CardContent>
            </Card>
            <Card className="card-premium">
              <CardContent className="p-3 text-center">
                <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm font-semibold">
                  {tool.createdAt
                    ? formatDistanceToNow(new Date(tool.createdAt), { addSuffix: false })
                    : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">Listed</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4" /> Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {tool.description}
              </p>
            </CardContent>
          </Card>

          {/* Specifications */}
          {(tool.brandName || tool.modelNumber || tool.condition) && (
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                  {tool.brandName && (
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">Brand</span>
                      <span className="text-sm font-medium">{tool.brandName}</span>
                    </div>
                  )}
                  {tool.modelNumber && (
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">Model</span>
                      <span className="text-sm font-medium">{tool.modelNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Condition</span>
                    <span className="text-sm font-medium">{condition.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <span className="text-sm font-medium">{tool.quantityAvailable || 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Details */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-4 w-4" /> Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(tool.listingPurpose === 'SALE' || tool.listingPurpose === 'BOTH') &&
                tool.salePrice && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-600 font-medium uppercase">
                          Sale Price
                        </p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">
                          {formatPrice(tool.salePrice)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-green-300 text-green-700 dark:text-green-400"
                      >
                        {tool.salePricingType === 'NEGOTIABLE'
                          ? 'Negotiable'
                          : 'Fixed Price'}
                      </Badge>
                    </div>
                  </div>
                )}

              {(tool.listingPurpose === 'LEASE' || tool.listingPurpose === 'BOTH') &&
                tool.leaseRate && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-600 font-medium uppercase">
                          Lease Rate
                        </p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                          {formatPrice(tool.leaseRate)}
                          <span className="text-sm font-normal">
                            /{tool.leaseRatePeriod?.toLowerCase() || 'day'}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-blue-300 text-blue-700 dark:text-blue-400"
                      >
                        {tool.leasePricingType === 'NEGOTIABLE'
                          ? 'Negotiable'
                          : 'Fixed Rate'}
                      </Badge>
                    </div>
                    {tool.depositRequired === 'REQUIRED' && tool.depositAmount && (
                      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/30">
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-blue-700 dark:text-blue-400">
                            Deposit required: {formatPrice(tool.depositAmount)}
                          </span>
                        </div>
                      </div>
                    )}
                    {tool.depositRequired === 'NEGOTIABLE' && (
                      <p className="mt-2 text-xs text-blue-600">Deposit is negotiable</p>
                    )}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Location */}
          {(tool.pickupLocation || tool.pickupLocationState) && (
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    {tool.pickupLocation && (
                      <p className="font-medium text-sm">{tool.pickupLocation}</p>
                    )}
                    {tool.pickupLocationState && (
                      <p className="text-sm text-muted-foreground">
                        {tool.pickupLocationState}, Nigeria
                      </p>
                    )}
                    {tool.deliveryAvailable && (
                      <p className="text-xs text-primary mt-2 flex items-center gap-1">
                        <Truck className="h-3 w-3" /> Delivery available
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posted info */}
          <div className="text-xs text-muted-foreground text-center py-4">
            Listed{' '}
            {tool.createdAt
              ? format(new Date(tool.createdAt), 'MMMM d, yyyy')
              : 'recently'}{' '}
            · ID: {tool.id?.slice(0, 8)}
          </div>
        </div>

        {/* Right: Contact Card (Desktop) */}
        <div className="hidden lg:block">
          <ToolContactCard member={tool.member} tool={tool} />
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-6">
          <Separator />
          <h2 className="text-xl font-bold">Similar Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((t: any) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}