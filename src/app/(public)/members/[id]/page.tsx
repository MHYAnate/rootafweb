// src/app/(public)/members/[id]/page.tsx — FULL updated file

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMember } from '@/hooks/use-members';
import { useMemberRatings } from '@/hooks/use-ratings';
import { useMemberCertificates } from '@/hooks/use-certificates';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RateMemberModal } from '@/components/ratings/rate-member-modal';
import { RatingSummary } from '@/components/ratings/rating-summary';
import { RatingCard } from '@/components/ratings/rating-card';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { formatNumber, formatDate } from '@/lib/format';
import {
  MapPin, Phone, Eye, Star, Package, Wrench,
  Hammer, Award, ChevronLeft, ChevronRight, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

// ── Reviews tab (self-contained pagination) ───────────────────────────────────

function ReviewsTab({ member }: { member: any }) {
  const [page, setPage] = useState(1);
  const LIMIT = 8;

  const { data, isLoading, isFetching } = useMemberRatings(member.id, page, LIMIT);

  const ratings     = data?.data ?? [];
  const meta        = data?.meta;
  const avgRating   = Number(member.averageRating) || 0;
  const totalRatings = Number(member.totalRatings) || 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {totalRatings > 0 && (
        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              Rating Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RatingSummary
              averageRating={avgRating}
              totalRatings={totalRatings}
              oneStarCount={member.oneStarCount   ?? 0}
              twoStarCount={member.twoStarCount   ?? 0}
              threeStarCount={member.threeStarCount ?? 0}
              fourStarCount={member.fourStarCount  ?? 0}
              fiveStarCount={member.fiveStarCount  ?? 0}
            />
          </CardContent>
        </Card>
      )}

      {/* CTA row */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {totalRatings > 0
            ? `${totalRatings} Review${totalRatings !== 1 ? 's' : ''}`
            : 'No reviews yet'}
        </h3>
        <RateMemberModal
          memberId={member.id}
          memberName={member.user?.fullName || 'this member'}
          ratingCategory="OVERALL_MEMBER"
        />
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner text="Loading reviews…" className="py-12" />}

      {/* Empty */}
      {!isLoading && ratings.length === 0 && (
        <div className="flex flex-col items-center py-14 text-center gap-3 text-muted-foreground">
          <MessageSquare className="h-10 w-10 opacity-30" />
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to leave a review!</p>
        </div>
      )}

      {/* Cards */}
      {ratings.length > 0 && (
        <div className={`grid gap-4 sm:grid-cols-2 transition-opacity duration-200 ${
          isFetching ? 'opacity-60 pointer-events-none' : ''
        }`}>
          {ratings.map((rating: any) => (
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
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MemberProfilePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useMember(id as string);
  const { data: certsData }        = useMemberCertificates(id as string);

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Member not found" />;

  const member      = data.data;
  const user        = member.user;
  const providerInfo = PROVIDER_TYPE_MAP[member.providerType];
  const certificates = certsData?.data || [];

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Members" href="/members" />

      {/* ── Hero ── */}
      <Card className="card-gold overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary/10 via-amber-50 to-blue-50" />
        <CardContent className="p-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <PremiumAvatar
              src={member.profilePhotoUrl}
              name={user?.fullName || ''}
              size="xl"
              verified={user?.verificationStatus === 'VERIFIED'}
              className="ring-4 ring-white"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-sm text-primary font-medium flex items-center gap-1">
                {providerInfo?.icon} {providerInfo?.label}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {member.localGovernmentArea}, {member.state}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(member.profileViewCount)} views
                </span>
              </div>
              <div className="mt-2">
                <RatingStars
                  rating={Number(member.averageRating)}
                  showValue
                  totalRatings={member.totalRatings}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {user?.phoneNumber && (
                <a href={`tel:${user.phoneNumber}`}>
                  <Button className="btn-premium rounded-xl gap-2">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                </a>
              )}
              {/* ── Rate member (overall) ── */}
              <RateMemberModal
                memberId={member.id}
                memberName={user?.fullName || 'this member'}
                ratingCategory="OVERALL_MEMBER"
              />
            </div>
          </div>

          {member.tagline && (
            <p className="text-muted-foreground mt-4 italic">
              &ldquo;{member.tagline}&rdquo;
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Stat pills ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products',     value: member.totalProducts,     icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Services',     value: member.totalServices,     icon: Wrench,  color: 'text-blue-600',   bg: 'bg-blue-50'    },
          { label: 'Tools',        value: member.totalTools,        icon: Hammer,  color: 'text-violet-600', bg: 'bg-violet-50'  },
          { label: 'Certificates', value: member.totalCertificates, icon: Award,   color: 'text-amber-600',  bg: 'bg-amber-50'   },
        ].map((stat) => (
          <Card key={stat.label} className="card-premium">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="rounded-xl bg-muted/50 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="about"        className="rounded-lg">About</TabsTrigger>
          <TabsTrigger value="products"     className="rounded-lg">Products</TabsTrigger>
          <TabsTrigger value="services"     className="rounded-lg">Services</TabsTrigger>
          <TabsTrigger value="tools"        className="rounded-lg">Tools</TabsTrigger>
          <TabsTrigger value="reviews"      className="rounded-lg gap-1.5">
            <Star className="h-3.5 w-3.5" />
            Reviews ({Number(member.totalRatings) || 0})
          </TabsTrigger>
          <TabsTrigger value="certificates" className="rounded-lg">Certificates</TabsTrigger>
        </TabsList>

        {/* About */}
        <TabsContent value="about">
          <Card className="card-premium">
            <CardContent className="p-6 space-y-4">
              {member.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              )}
              {member.yearsOfExperience && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{member.yearsOfExperience} years</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium">{member.address}</span>
              </div>
              {member.specializations?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec: any) => (
                      <Badge key={spec.id} variant="outline" className="rounded-lg">
                        {spec.category?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.products?.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <Card className="card-premium hover:shadow-md transition-shadow group">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-sm text-primary font-bold">
                      {p.priceDisplayText || 'Contact for price'}
                    </p>
                    {/* <Separator />
                    <div onClick={(e) => e.preventDefault()}>
                      <RateMemberModal
                        memberId={member.id}
                        memberName={user?.fullName || ''}
                        ratingCategory="PRODUCT_RATING"
                        productId={p.id}
                        trigger={
                          <button className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition-colors">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            Rate this product
                          </button>
                        }
                      />
                    </div> */}
                  </CardContent>
                </Card>
              </Link>
            ))}
            {(!member.products || member.products.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No products listed yet
              </p>
            )}
          </div>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.services?.map((s: any) => (
              <Link key={s.id} href={`/services/${s.id}`}>
                <Card className="card-premium hover:shadow-md transition-shadow group">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-sm text-primary font-bold">
                      {s.priceDisplayText || 'Contact for price'}
                    </p>
                    {/* <Separator />
                    <div onClick={(e) => e.preventDefault()}>
                      <RateMemberModal
                        memberId={member.id}
                        memberName={user?.fullName || ''}
                        ratingCategory="SERVICE_RATING"
                        serviceId={s.id}
                        trigger={
                          <button className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition-colors">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            Rate this service
                          </button>
                        }
                      />
                    </div> */}
                  </CardContent>
                </Card>
              </Link>
            ))}
            {(!member.services || member.services.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No services listed yet
              </p>
            )}
          </div>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.tools?.map((t: any) => (
              <Link key={t.id} href={`/tools/${t.id}`}>
                <Card className="card-premium hover:shadow-md transition-shadow group">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {t.name}
                    </h4>
                    <div className="space-y-0.5">
                      {t.salePriceDisplayText && (
                        <p className="text-sm text-primary font-bold">
                          Sale: {t.salePriceDisplayText}
                        </p>
                      )}
                      {t.leasePriceDisplayText && (
                        <p className="text-sm text-violet-600 font-semibold">
                          Lease: {t.leasePriceDisplayText}
                        </p>
                      )}
                      {!t.salePriceDisplayText && !t.leasePriceDisplayText && (
                        <p className="text-sm text-muted-foreground">Contact for price</p>
                      )}
                    </div>
                    {t.condition && (
                      <Badge variant="outline" className="rounded-lg text-xs">
                        {t.condition}
                      </Badge>
                    )}
                    {/* <Separator /> */}
                    {/* ── Rate this tool/lease ── */}
                    {/* <div onClick={(e) => e.preventDefault()}>
                      <RateMemberModal
                        memberId={member.id}
                        memberName={user?.fullName || ''}
                        ratingCategory="TOOL_LEASE_RATING"
                        
                        trigger={
                          <button className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition-colors">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            Rate this tool / lease
                          </button>
                        }
                      />
                    </div> */}
                  </CardContent>
                </Card>
              </Link>
            ))}
            {(!member.tools || member.tools.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No tools listed yet
              </p>
            )}
          </div>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <ReviewsTab member={member} />
        </TabsContent>

        {/* Certificates */}
        <TabsContent value="certificates">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert: any) => (
              <Card key={cert.id} className="card-premium">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {cert.certificateThumbnailUrl ? (
                      <img
                        src={cert.certificateThumbnailUrl}
                        alt={cert.certificateName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Award className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{cert.certificateName}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(cert.dateIssued)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certificates.length === 0 && (
              <p className="text-muted-foreground text-center py-8 col-span-full">
                No certificates uploaded
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}