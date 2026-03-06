// src/components/tools/tool-card.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Eye,
  MapPin,
  Wrench,
  Calendar,
  Truck,
  Package,
  Heart,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ToolCardProps {
  tool: any;
  variant?: 'grid' | 'list';
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const conditionConfig: Record<string, { label: string; className: string }> = {
  NEW: {
    label: 'New',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  FAIRLY_USED: {
    label: 'Fairly Used',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  USED: {
    label: 'Used',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  REFURBISHED: {
    label: 'Refurbished',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
};

const purposeConfig: Record<string, { label: string; className: string }> = {
  SALE: {
    label: 'For Sale',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  LEASE: {
    label: 'For Lease',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  },
  BOTH: {
    label: 'Sale & Lease',
    className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  },
};

function formatPrice(amount: number | null | undefined) {
  if (!amount) return null;
  return `₦${Number(amount).toLocaleString()}`;
}

export function ToolCard({ tool, variant = 'grid' }: ToolCardProps) {
  const primaryImage = tool.images?.find((i: any) => i.isPrimary) || tool.images?.[0];
  const condition = conditionConfig[tool.condition] || conditionConfig.USED;
  const purpose = purposeConfig[tool.listingPurpose] || purposeConfig.SALE;
  const sellerName = tool.member?.user?.fullName || 'Unknown Seller';
  const location = tool.pickupLocationState || tool.member?.state || '';
  const timeAgo = tool.createdAt
    ? formatDistanceToNow(new Date(tool.createdAt), { addSuffix: true })
    : '';

  if (variant === 'list') {
    return (
      <Link href={`/tools/${tool.id}`}>
        <Card className="card-premium overflow-hidden group hover:shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 bg-muted">
              {primaryImage ? (
                <Image
                  src={primaryImage.imageUrl || primaryImage.thumbnailUrl}
                  alt={tool.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[160px]">
                  <Wrench className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge className={condition.className}>{condition.label}</Badge>
              </div>
            </div>

            {/* Content */}
            <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    {tool.category && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tool.category.name}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className={purpose.className}>
                    {purpose.label}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {tool.shortDescription || tool.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex items-center gap-4">
                  {tool.salePrice && (
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(tool.salePrice)}
                    </span>
                  )}
                  {tool.leaseRate && (
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(tool.leaseRate)}/{tool.leaseRatePeriod?.toLowerCase() || 'day'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {tool.viewCount || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={`/tools/${tool.id}`}>
      <Card className="card-premium overflow-hidden group h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 bg-muted overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl || primaryImage.thumbnailUrl}
              alt={tool.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Wrench className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}

          {/* Overlays */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge className={condition.className}>{condition.label}</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className={purpose.className}>{purpose.label}</Badge>
          </div>

          {tool.deliveryAvailable && (
            <div className="absolute bottom-2 right-2">
              <Badge
                variant="secondary"
                className="bg-white/90 dark:bg-black/70 text-xs gap-1"
              >
                <Truck className="h-3 w-3" /> Delivery
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {tool.name}
            </h3>
            {tool.category && (
              <p className="text-xs text-muted-foreground mt-1">
                {tool.category.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mt-3 space-y-1">
            {tool.salePrice && (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(tool.salePrice)}
                </span>
                {tool.salePricingType === 'NEGOTIABLE' && (
                  <span className="text-[10px] text-muted-foreground uppercase">
                    Negotiable
                  </span>
                )}
              </div>
            )}
            {tool.leaseRate && (
              <p className="text-xs text-muted-foreground">
                Lease: {formatPrice(tool.leaseRate)}/
                {tool.leaseRatePeriod?.toLowerCase() || 'day'}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{location || 'Nigeria'}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {tool.quantityAvailable > 1 && (
                <span className="flex items-center gap-0.5">
                  <Package className="h-3 w-3" />
                  {tool.quantityAvailable}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {timeAgo.replace(' ago', '').replace('about ', '')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}