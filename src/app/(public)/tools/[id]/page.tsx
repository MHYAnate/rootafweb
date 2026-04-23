// src/app/(public)/tools/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTool, useTools } from '@/hooks/use-tools';
import { useMemberRatings } from '@/hooks/use-ratings';
import { ToolImageGallery } from '@/components/tools/tool-image-gallery';
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
  Wrench, MapPin, Calendar, Eye, Package, Tag,
  Truck, ShieldCheck, Info, Star, Layers, Hash,
  CheckCircle2, ChevronLeft, ChevronRight, MessageSquare,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

// ── Condition / purpose config (unchanged) ────────────────────────────────────

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
  toolId,
  memberName,
  averageRating,
  totalRatings,
}: {
  memberId: string;
  toolId: string;
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
    <div className="space-y-4 pt-6">
      <Separator />

      <Card className="card-premium">
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
          {/* ── Rate this tool / lease ── */}
          <RateMemberModal
            memberId={memberId}
            memberName={memberName}
            ratingCategory="TOOL_LEASE_RATING"
            toolId={toolId}
          />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary */}
          {totalRatings > 0 && (
            <>
              <RatingSummary
                averageRating={averageRating}
                totalRatings={totalRatings}
              />
              <Separator />
            </>
          )}

          {isLoading && <LoadingSpinner text="Loading reviews…" className="py-8" />}

          {!isLoading && allRatings.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center gap-3 text-muted-foreground">
              <MessageSquare className="h-10 w-10 opacity-30" />
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm">
                Be the first to review this tool / lease!
              </p>
            </div>
          )}

          {allRatings.length > 0 && (
            <div className={`grid gap-4 sm:grid-cols-2 transition-opacity duration-200 ${
              isFetching ? 'opacity-60 pointer-events-none' : ''
            }`}>
              {allRatings.map((rating: any) => (
                <RatingCard key={rating.id} rating={rating} showReviewer />
              ))}
            </div>
          )}

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
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ToolDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const { data, isLoading, isError } = useTool(id as string);

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

  const condition    = conditionConfig[tool.condition] || conditionConfig.USED;
  const relatedTools = (relatedData?.data || []).filter((t: any) => t.id !== tool.id).slice(0, 3);
  const avgRating    = Number(tool.averageRating) || 0;
  const totalRatings = Number(tool.totalRatings)  || 0;

  return (
    <div className="space-y-6">
      <BackButton href="/tools" label="Back to Marketplace" />

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Images + Details ── */}
        <div className="lg:col-span-2 space-y-6">
          <ToolImageGallery images={tool.images || []} toolName={tool.name} />

          {/* Title & badges */}
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
            {/* Inline rating stars under title */}
            {avgRating > 0 && (
              <div className="mt-2">
                <RatingStars
                  rating={avgRating}
                  size="sm"
                  showValue
                  totalRatings={totalRatings}
                />
              </div>
            )}
          </div>

          {/* Mobile contact card */}
          <div className="lg:hidden">
            <ToolContactCard member={tool.member} tool={tool} />
          </div>

          {/* Quick info grid */}
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
                <Star className="h-4 w-4 mx-auto text-amber-400 fill-amber-400 mb-1" />
                <p className="text-sm font-semibold">
                  {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">Rating</p>
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

          {/* Pricing details */}
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
                        <p className="text-xs text-green-600 font-medium uppercase">Sale Price</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">
                          {formatPrice(tool.salePrice)}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-green-300 text-green-700 dark:text-green-400">
                        {tool.salePricingType === 'NEGOTIABLE' ? 'Negotiable' : 'Fixed Price'}
                      </Badge>
                    </div>
                  </div>
                )}

              {(tool.listingPurpose === 'LEASE' || tool.listingPurpose === 'BOTH') &&
                tool.leaseRate && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-600 font-medium uppercase">Lease Rate</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                          {formatPrice(tool.leaseRate)}
                          <span className="text-sm font-normal">
                            /{tool.leaseRatePeriod?.toLowerCase() || 'day'}
                          </span>
                        </p>
                      </div>
                      <Badge variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-400">
                        {tool.leasePricingType === 'NEGOTIABLE' ? 'Negotiable' : 'Fixed Rate'}
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
                    <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
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

          {/* ── Reviews section ── */}
          {tool.member && (
            <ToolReviews
              memberId={tool.member.id}
              toolId={tool.id}
              memberName={tool.member.user?.fullName || ''}
              averageRating={avgRating}
              totalRatings={totalRatings}
            />
          )}
        </div>

        {/* ── Right: Contact card (desktop) ── */}
        <div className="hidden lg:block">
          {/* Sticky wrapper so card stays visible while scrolling */}
          <div className="sticky top-24 space-y-4">
            <ToolContactCard member={tool.member} tool={tool} />

            {/* ── Rate this tool / lease ── secondary CTA in sidebar */}
            {tool.member && (
              <RateMemberModal
                memberId={tool.member.id}
                memberName={tool.member.user?.fullName || ''}
                ratingCategory="TOOL_LEASE_RATING"
                toolId={tool.id}
                trigger={
                  <Button variant="outline" className="w-full rounded-xl gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Rate This Tool / Lease
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Related tools */}
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