// src/app/(public)/products/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/use-products';
import { useMemberRatings } from '@/hooks/use-ratings';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RateMemberModal } from '@/components/ratings/rate-member-modal';
import { RatingSummary } from '@/components/ratings/rating-summary';
import { RatingCard } from '@/components/ratings/rating-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Package, MapPin, Phone, Eye, Star,
  Tag, ExternalLink, ChevronLeft, ChevronRight, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatNumber } from '@/lib/format';

// ── Paginated reviews section ─────────────────────────────────────────────────

function ProductReviews({
  memberId,
  productId,
  memberName,
  averageRating,
  totalRatings,
}: {
  memberId: string;
  productId: string;
  memberName: string;
  averageRating: number;
  totalRatings: number;
}) {
  const [page, setPage] = useState(1);
  const LIMIT = 6;

  const { data, isLoading, isFetching } = useMemberRatings(memberId, page, LIMIT);

  // Filter to only show ratings for this specific product
  const allRatings = data?.data ?? [];
  const ratings = allRatings.filter(
    (r: any) => r.productId === productId || r.ratingCategory === 'PRODUCT_RATING',
  );
  const meta = data?.meta;

  return (
    <Card className="card-premium mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          Customer Reviews
          {totalRatings > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({totalRatings})
            </span>
          )}
        </CardTitle>
        {/* Rate this product button */}
        <RateMemberModal
          memberId={memberId}
          memberName={memberName}
          ratingCategory="PRODUCT_RATING"
          productId={productId}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rating summary bar chart */}
        {totalRatings > 0 && (
          <>
            <RatingSummary
              averageRating={averageRating}
              totalRatings={totalRatings}
            />
            <Separator />
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <LoadingSpinner text="Loading reviews…" className="py-8" />
        )}

        {/* Empty state */}
        {!isLoading && allRatings.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-30" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        )}

        {/* Review cards */}
        {allRatings.length > 0 && (
          <div
            className={`grid gap-4 sm:grid-cols-2 transition-opacity duration-200 ${
              isFetching ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            {allRatings.map((rating: any) => (
              <RatingCard key={rating.id} rating={rating} showReviewer />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline" size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="outline" size="sm"
              disabled={page === meta.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProduct(id as string);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading product..." className="py-24" />;
  }
  if (error) return <ErrorDisplay message="Product not found" />;

  const product = data?.data;
  if (!product) return <ErrorDisplay message="Product not found" />;

  const images   = product.images || [];
  const member   = product.member;
  const avgRating   = Number(product.averageRating) || 0;
  const totalRatings = Number(product.totalRatings) || 0;

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Products" href="/products" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── Image Gallery ── */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden border relative">
            {images[selectedImage]?.imageUrl ? (
              <Image
                src={images[selectedImage].imageUrl}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-20 w-20 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img
                    src={img.thumbnailUrl || img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(product.viewCount)} views
              </span>
              <RatingStars
                rating={avgRating}
                size="sm"
                showValue
                totalRatings={totalRatings}
              />
            </div>
          </div>

          <Separator />

          {/* Price block */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <PriceDisplay
              pricingType={product.pricingType}
              amount={product.priceAmount ? Number(product.priceAmount) : null}
              displayText={product.priceDisplayText}
              className="text-2xl font-bold text-primary"
              showBadge
            />
            {product.pricePerUnit && (
              <p className="text-sm text-muted-foreground mt-1">{product.pricePerUnit}</p>
            )}
            {product.bulkPriceAmount && (
              <p className="text-sm text-muted-foreground mt-1">
                Bulk: {formatCurrency(Number(product.bulkPriceAmount))}{' '}
                (min {product.bulkMinimumQuantity} units)
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
                <span className="font-medium">
                  {product.minimumOrderQuantity} {product.unitOfMeasure}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Seller card */}
          {member && (
            <Card className="card-gold">
              <CardContent className="p-4">
                <Link
                  href={`/members/${member.id}`}
                  className="flex items-center gap-3 group"
                >
                  <PremiumAvatar
                    src={member.profilePhotoThumbnail}
                    name={member.user?.fullName || ''}
                    size="md"
                    verified
                  />
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {member.user?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{member.state}
                    </p>
                    {/* Seller's overall rating */}
                    {Number(member.averageRating) > 0 && (
                      <RatingStars
                        rating={Number(member.averageRating)}
                        size="sm"
                        showValue
                        className="mt-0.5"
                      />
                    )}
                  </div>
                </Link>

                <div className="mt-3 flex gap-2">
                  {member.user?.phoneNumber && (
                    <a href={`tel:${member.user.phoneNumber}`} className="flex-1">
                      <Button className="w-full btn-premium rounded-xl gap-2" size="sm">
                        <Phone className="h-4 w-4" /> Contact Seller
                      </Button>
                    </a>
                  )}
                  {/* ── Rate this product ── */}
                  <RateMemberModal
                    memberId={member.id}
                    memberName={member.user?.fullName || ''}
                    ratingCategory="PRODUCT_RATING"
                    productId={product.id}
                    trigger={
                      <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                        <Star className="h-4 w-4 text-amber-500" />
                        Rate
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Description ── */}
      <div className="mt-10">
        <Card className="card-premium">
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
            {product.externalVideoLink && (
              <a
                href={product.externalVideoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary mt-4 hover:underline text-sm"
              >
                <ExternalLink className="h-4 w-4" /> Watch Video
              </a>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Reviews section ── */}
      {member && (
        <ProductReviews
          memberId={member.id}
          productId={product.id}
          memberName={member.user?.fullName || ''}
          averageRating={avgRating}
          totalRatings={totalRatings}
        />
      )}
    </div>
  );
}