// src/components/tools/tool-contact-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  MessageCircle,
  Star,
  MapPin,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';

interface ToolContactCardProps {
  member: any;
  tool: any;
}

export function ToolContactCard({ member, tool }: ToolContactCardProps) {
  const sellerName = member?.user?.fullName || 'Unknown Seller';
  const phone = member?.user?.phoneNumber || '';
  const whatsappNumber = phone.replace(/^0/, '234').replace(/\+/, '');
  const location = tool.pickupLocationState || member?.state || '';
  const rating = member?.averageRating;

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in your tool "${tool.name}" listed on the platform. Is it still available?`,
  );

  return (
    <Card className="card-premium sticky top-24">
      <CardContent className="p-5 space-y-5">
        {/* Price Summary */}
        <div className="space-y-2">
          {tool.salePrice && (
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">
                Sale Price
              </p>
              <p className="text-2xl font-bold text-primary">
                ₦{Number(tool.salePrice).toLocaleString()}
              </p>
              {tool.salePricingType === 'NEGOTIABLE' && (
                <Badge variant="outline" className="text-[10px] mt-1">
                  Negotiable
                </Badge>
              )}
            </div>
          )}

          {tool.leaseRate && (
            <div className={tool.salePrice ? 'pt-2 border-t' : ''}>
              <p className="text-xs text-muted-foreground uppercase font-medium">
                Lease Rate
              </p>
              <p className="text-xl font-bold">
                ₦{Number(tool.leaseRate).toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">
                  /{tool.leaseRatePeriod?.toLowerCase() || 'day'}
                </span>
              </p>
              {tool.depositRequired === 'REQUIRED' && tool.depositAmount && (
                <p className="text-xs text-muted-foreground mt-1">
                  Deposit: ₦{Number(tool.depositAmount).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="gold-divider" />

        {/* Seller Info */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
            {member?.profilePhotoUrl ? (
              <Image
                src={member.profilePhotoUrl}
                alt={sellerName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{sellerName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {rating && (
                <span className="flex items-center gap-0.5 text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {Number(rating).toFixed(1)}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {phone && (
            <Button
              asChild
              className="w-full h-11 rounded-lg gap-2 btn-premium"
            >
              <a href={`tel:${phone}`}>
                <Phone className="h-4 w-4" />
                Call Seller
              </a>
            </Button>
          )}

          {phone && (
            <Button
              asChild
              variant="outline"
              className="w-full h-11 rounded-lg gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}

          {member?.user?.id && (
            <Link href={`/members/${member.id}`}>
              <Button variant="ghost" className="w-full h-10 rounded-lg gap-2 text-sm">
                <ExternalLink className="h-3.5 w-3.5" />
                View Seller Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Verified Member</span>
          </div>
          {tool.deliveryAvailable && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                🚚
              </Badge>
              <span>Delivery available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}