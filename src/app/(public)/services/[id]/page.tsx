// src/app/(public)/services/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useService } from '@/hooks/use-services';
import { useMemberRatings } from '@/hooks/use-ratings';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PriceDisplay } from '@/components/shared/price-display';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import { RateMemberModal } from '@/components/ratings/rate-member-modal';
import { RatingSummary } from '@/components/ratings/rating-summary';
import { RatingCard } from '@/components/ratings/rating-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Wrench, MapPin, Phone, Clock,
  Star, ChevronLeft, ChevronRight, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

// ── Service reviews section ───────────────────────────────────────────────────

function ServiceReviews({
  memberId,
  serviceId,
  memberName,
  averageRating,
  totalRatings,
}: {
  memberId: string;
  serviceId: string;
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
    <Card className="card-premium">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          Client Reviews
          {totalRatings > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({totalRatings})
            </span>
          )}
        </CardTitle>
        <RateMemberModal
          memberId={memberId}
          memberName={memberName}
          ratingCategory="SERVICE_RATING"
          serviceId={serviceId}
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

        {isLoading && <LoadingSpinner text="Loading reviews…" className="py-8" />}

        {!isLoading && allRatings.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-30" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to review this service!</p>
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
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useService(id as string);

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Service not found" />;

  const service = data.data;
  const member  = service.member;
  const avgRating    = Number(service.averageRating) || 0;
  const totalRatings = Number(service.totalRatings)  || 0;

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Services" href="/services" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {service.category?.name}
            </p>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge variant="outline" className="rounded-lg">{service.availability}</Badge>
              {/* Inline star summary */}
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

          {/* Price */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <PriceDisplay
              pricingType={service.pricingType}
              amount={service.startingPrice ? Number(service.startingPrice) : null}
              displayText={service.priceDisplayText}
              className="text-2xl font-bold text-primary"
              showBadge
            />
            {service.priceBasis && (
              <p className="text-sm text-muted-foreground mt-1">{service.priceBasis}</p>
            )}
          </div>

          {/* About */}
          <Card className="card-premium">
            <CardHeader><CardTitle>About This Service</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </CardContent>
          </Card>

          {/* Service area */}
          {service.serviceArea && (
            <Card className="card-premium">
              <CardHeader><CardTitle>Service Area</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.serviceArea}</p>
                {service.workingDays?.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {service.workingDays.join(', ')}
                    {service.workingHoursStart &&
                      ` (${service.workingHoursStart} - ${service.workingHoursEnd})`}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Portfolio images */}
          {service.images?.length > 0 && (
            <Card className="card-premium">
              <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.images.map((img: any, idx: number) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={img.imageUrl}
                        alt={img.caption || ''}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Reviews section ── */}
          {member && (
            <ServiceReviews
              memberId={member.id}
              serviceId={service.id}
              memberName={member.user?.fullName || ''}
              averageRating={avgRating}
              totalRatings={totalRatings}
            />
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {member && (
            <Card className="card-gold sticky top-24">
              <CardContent className="p-5 space-y-4">
                {/* Provider info */}
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

                <Separator />

                {/* Contact */}
                {member.user?.phoneNumber && (
                  <a href={`tel:${member.user.phoneNumber}`}>
                    <Button className="w-full btn-premium rounded-xl gap-2">
                      <Phone className="h-4 w-4" /> Contact Provider
                    </Button>
                  </a>
                )}

                {/* ── Rate this service ── */}
                <RateMemberModal
                  memberId={member.id}
                  memberName={member.user?.fullName || ''}
                  ratingCategory="SERVICE_RATING"
                  serviceId={service.id}
                  trigger={
                    <Button variant="outline" className="w-full rounded-xl gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      Rate This Service
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}