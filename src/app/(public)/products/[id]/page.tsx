'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/use-products';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { DateDisplay } from '@/components/shared/date-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, Phone, Eye, Star, Tag, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatCurrency, formatNumber } from '@/lib/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProduct(id as string);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) return <LoadingSpinner size="lg" text="Loading product..." className="py-24" />;
  if (error) return <ErrorDisplay message="Product not found" />;

  const product = data?.data;
  if (!product) return <ErrorDisplay message="Product not found" />;

  const images = product.images || [];
  const member = product.member;

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Products" href="/products" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden border relative">
            {images[selectedImage]?.imageUrl ? (
              <Image src={images[selectedImage].imageUrl} alt={product.name} fill className="object-contain" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-20 w-20 text-muted-foreground/20" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'}`}
                >
                  <img src={img.thumbnailUrl || img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{formatNumber(product.viewCount)} views</span>
              <RatingStars rating={Number(product.averageRating)} size="sm" showValue totalRatings={product.totalRatings} />
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <PriceDisplay pricingType={product.pricingType} amount={product.priceAmount ? Number(product.priceAmount) : null}
              displayText={product.priceDisplayText} className="text-2xl font-bold text-primary" showBadge />
            {product.pricePerUnit && <p className="text-sm text-muted-foreground mt-1">{product.pricePerUnit}</p>}
            {product.bulkPriceAmount && (
              <p className="text-sm text-muted-foreground mt-1">
                Bulk: {formatCurrency(Number(product.bulkPriceAmount))} (min {product.bulkMinimumQuantity} units)
              </p>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Availability</span>
              <Badge variant="outline" className="rounded-lg">{product.availability}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Unit</span>
              <span className="font-medium">{product.unitOfMeasure}</span>
            </div>
            {product.minimumOrderQuantity && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Min Order</span>
                <span className="font-medium">{product.minimumOrderQuantity} {product.unitOfMeasure}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Contact Member */}
          {member && (
            <Card className="card-gold">
              <CardContent className="p-4">
                <Link href={`/members/${member.id}`} className="flex items-center gap-3 group">
                  <PremiumAvatar src={member.profilePhotoThumbnail} name={member.user?.fullName || ''} size="md" verified />
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">{member.user?.fullName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{member.state}
                    </p>
                  </div>
                </Link>
                <div className="mt-3 flex gap-2">
                  <Button className="flex-1 btn-premium rounded-xl gap-2" size="sm">
                    <Phone className="h-4 w-4" />Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <Card className="card-premium">
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
            {product.externalVideoLink && (
              <a href={product.externalVideoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary mt-4 hover:underline text-sm">
                <ExternalLink className="h-4 w-4" />Watch Video
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}