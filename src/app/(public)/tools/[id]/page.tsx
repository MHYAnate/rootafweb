// src/app/(public)/tools/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTool, useTools } from '@/hooks/use-tools';
import { useMemberRatings } from '@/hooks/use-ratings';
import { ToolContactCard } from '@/components/tools/tool-contact-card';
import { ToolCard } from '@/components/tools/tool-card';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { RatingStars } from '@/components/shared/rating-stars';
import { RateMemberModal } from '@/components/ratings/rate-member-modal';
import { RatingSummary } from '@/components/ratings/rating-summary';
import { RatingCard } from '@/components/ratings/rating-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Wrench, MapPin, Eye, Tag, Truck, ShieldCheck, 
  Info, Star, Layers, CheckCircle2, ChevronLeft, 
  ChevronRight, MessageSquare, Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

// ── Condition config ──────────────────────────────────────────────────────────

const conditionConfig: Record<string, {
  label: string;
  className: string;
  description: string;
}> = {
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

// ── Tool reviews section ──────────────────────────────────────────────────────

function ToolReviews({
  memberId,
  memberName,
  averageRating,
  totalRatings,
}: {
  memberId: string;
  memberName: string;
  averageRating: number;
  totalRatings: number;
}) {
  const [page, setPage] = useState(1);
  const LIMIT = 6;

  const { data, isLoading, isFetching } = useMemberRatings(memberId, page, LIMIT);
  const allRatings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <Card className="card-premium mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          Reviews & Ratings
          {totalRatings > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({totalRatings})
            </span>
          )}
        </CardTitle>

        <RateMemberModal
          memberId={memberId}
          memberName={memberName}
          ratingCategory="TOOL_LEASE_RATING"
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {totalRatings > 0 && (
          <>
            <RatingSummary
              averageRating={averageRating}
              totalRatings={totalRatings}
            />
            <Separator />
          </>
        )}

        {isLoading && (
          <LoadingSpinner text="Loading reviews…" className="py-8" />
        )}

        {!isLoading && allRatings.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-30" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to review this tool / lease!</p>
          </div>
        )}

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

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
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
              variant="outline"
              size="sm"
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

export default function ToolDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useTool(id as string);
  const [selectedImage, setSelectedImage] = useState(0);

  const tool = data?.data;

  const { data: relatedData } = useTools({
    categoryId: tool?.categoryId,
    limit: 4,
  });

  if (isLoading) return <LoadingSpinner size="lg" text="Loading tool..." className="py-24" />;

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

  const condition    = conditionConfig[tool.condition] || conditionConfig.USED;
  const relatedTools = (relatedData?.data || [])
    .filter((t: any) => t.id !== tool.id)
    .slice(0, 3);
  const avgRating    = Number(tool.averageRating) || 0;
  const totalRatings = Number(tool.totalRatings)  || 0;
  const images       = tool.images || [];

  return (
    <div className="container-custom py-10">
      <BackButton href="/tools" label="Back to Marketplace" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">

        {/* ── Left: Image Gallery & Description ── */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden border relative">
              {images[selectedImage]?.imageUrl ? (
                <Image
                  src={images[selectedImage].imageUrl}
                  alt={tool.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-20 w-20 text-muted-foreground/20" />
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

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" /> Description
            </h3>
            <div className="p-6 rounded-2xl bg-card border text-sm leading-relaxed whitespace-pre-wrap">
              {tool.description}
            </div>
          </div>
        </div>

        {/* ── Right: Tool Info ── */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={condition.className}>{condition.label}</Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                {purposeLabels[tool.listingPurpose] || tool.listingPurpose}
              </Badge>
              {tool.deliveryAvailable && (
                <Badge variant="secondary" className="gap-1 bg-muted">
                  <Truck className="h-3 w-3" /> Delivery Available
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {tool.category && (
                <span className="flex items-center gap-1 font-medium">
                  <Layers className="h-4 w-4" />
                  {tool.category.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(tool.viewCount || 0).toLocaleString()} views
              </span>
              {avgRating > 0 && (
                <RatingStars
                  rating={avgRating}
                  size="sm"
                  showValue
                  totalRatings={totalRatings}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing Blocks */}
          <div className="space-y-4">
            {(tool.listingPurpose === 'SALE' || tool.listingPurpose === 'BOTH') && tool.salePrice && (
              <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Sale Price</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {formatPrice(tool.salePrice)}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-700 dark:text-green-400 bg-white/50 dark:bg-black/20">
                    {tool.salePricingType === 'NEGOTIABLE' ? 'Negotiable' : 'Fixed Price'}
                  </Badge>
                </div>
              </div>
            )}

            {(tool.listingPurpose === 'LEASE' || tool.listingPurpose === 'BOTH') && tool.leaseRate && (
              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Lease Rate</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {formatPrice(tool.leaseRate)}
                      <span className="text-base font-medium text-blue-600/70 dark:text-blue-400/70 ml-1">
                        /{tool.leaseRatePeriod?.toLowerCase() || 'day'}
                      </span>
                    </p>
                  </div>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-400 bg-white/50 dark:bg-black/20">
                    {tool.leasePricingType === 'NEGOTIABLE' ? 'Negotiable' : 'Fixed Rate'}
                  </Badge>
                </div>
                {tool.depositRequired === 'REQUIRED' && tool.depositAmount && (
                  <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-800/30">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-300">
                        Deposit required: {formatPrice(tool.depositAmount)}
                      </span>
                    </div>
                  </div>
                )}
                {tool.depositRequired === 'NEGOTIABLE' && (
                  <p className="mt-3 text-sm text-blue-600 font-medium">Deposit is negotiable</p>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Condition</span>
              <span className="font-medium">{condition.label}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Layers className="w-4 h-4" /> Quantity Available</span>
              <span className="font-medium">{tool.quantityAvailable || 1}</span>
            </div>
            {tool.brandName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Wrench className="w-4 h-4" /> Brand</span>
                <span className="font-medium">{tool.brandName}</span>
              </div>
            )}
            {tool.modelNumber && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Tag className="w-4 h-4" /> Model</span>
                <span className="font-medium">{tool.modelNumber}</span>
              </div>
            )}
            {(tool.pickupLocation || tool.pickupLocationState) && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                <span className="font-medium text-right">
                  {tool.pickupLocation}
                  {tool.pickupLocation && tool.pickupLocationState ? ', ' : ''}
                  {tool.pickupLocationState && `${tool.pickupLocationState}, Nigeria`}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tool.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground flex items-center gap-1.5 font-medium"
                >
                  <Tag className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2">
            Listed {tool.createdAt ? format(new Date(tool.createdAt), 'MMMM d, yyyy') : 'recently'} · ID: {tool.id?.slice(0, 8)}
          </div>

          {/* Seller / Contact Card */}
          <div className="pt-6">
            <ToolContactCard member={tool.member} tool={tool} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {tool.member && (
        <div className="mt-12">
          <ToolReviews
            memberId={tool.member.id}
            memberName={tool.member.user?.fullName || ''}
            averageRating={avgRating}
            totalRatings={totalRatings}
          />
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-6 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Similar Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTools.map((t: any) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}