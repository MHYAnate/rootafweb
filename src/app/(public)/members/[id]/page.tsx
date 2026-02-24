'use client';

import { useParams } from 'next/navigation';
import { useMember } from '@/hooks/use-members';
import { useMemberRatings } from '@/hooks/use-ratings';
import { useMemberCertificates } from '@/hooks/use-certificates';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { formatNumber, formatDate, formatPhoneNumber } from '@/lib/format';
import { MapPin, Phone, Mail, Eye, Star, Package, Wrench, Hammer, Award, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function MemberProfilePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useMember(id as string);
  const { data: ratingsData } = useMemberRatings(id as string, { limit: 5 });
  const { data: certsData } = useMemberCertificates(id as string);

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Member not found" />;

  const member = data.data;
  const user = member.user;
  const providerInfo = PROVIDER_TYPE_MAP[member.providerType];
  const ratings = ratingsData?.data || [];
  const certificates = certsData?.data || [];

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Members" href="/members" />

      {/* Hero Card */}
      <Card className="card-gold overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary/10 via-amber-50 to-blue-50" />
        <CardContent className="p-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <PremiumAvatar src={member.profilePhotoUrl} name={user?.fullName || ''} size="xl"
              verified={user?.verificationStatus === 'VERIFIED'} className="ring-4 ring-white" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-sm text-primary font-medium flex items-center gap-1">{providerInfo?.icon} {providerInfo?.label}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{member.localGovernmentArea}, {member.state}</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatNumber(member.profileViewCount)} views</span>
              </div>
              <div className="mt-2">
                <RatingStars rating={Number(member.averageRating)} showValue totalRatings={member.totalRatings} />
              </div>
            </div>
            <div className="flex gap-2">
              {user?.phoneNumber && (
                <a href={`tel:${user.phoneNumber}`}>
                  <Button className="btn-premium rounded-xl gap-2"><Phone className="h-4 w-4" />Call</Button>
                </a>
              )}
            </div>
          </div>
          {member.tagline && <p className="text-muted-foreground mt-4 italic">"{member.tagline}"</p>}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products', value: member.totalProducts, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Services', value: member.totalServices, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tools', value: member.totalTools, icon: Hammer, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Certificates', value: member.totalCertificates, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      {/* Tabs */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="about" className="rounded-lg">About</TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg">Products</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg">Services</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
          <TabsTrigger value="certificates" className="rounded-lg">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card className="card-premium">
            <CardContent className="p-6 space-y-4">
              {member.bio && <div><h4 className="font-semibold mb-2">Bio</h4><p className="text-muted-foreground">{member.bio}</p></div>}
              {member.yearsOfExperience && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Experience</span><span className="font-medium">{member.yearsOfExperience} years</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Address</span><span className="font-medium">{member.address}</span></div>
              {member.specializations?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec: any) => (
                      <Badge key={spec.id} variant="outline" className="rounded-lg">{spec.category?.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.products?.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <Card className="card-premium"><CardContent className="p-4"><h4 className="font-semibold">{p.name}</h4><p className="text-sm text-primary font-bold mt-1">{p.priceDisplayText || 'Contact for price'}</p></CardContent></Card>
              </Link>
            ))}
            {(!member.products || member.products.length === 0) && <p className="text-muted-foreground col-span-full text-center py-8">No products listed yet</p>}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.services?.map((s: any) => (
              <Link key={s.id} href={`/services/${s.id}`}>
                <Card className="card-premium"><CardContent className="p-4"><h4 className="font-semibold">{s.name}</h4><p className="text-sm text-primary font-bold mt-1">{s.priceDisplayText || 'Contact for price'}</p></CardContent></Card>
              </Link>
            ))}
            {(!member.services || member.services.length === 0) && <p className="text-muted-foreground col-span-full text-center py-8">No services listed yet</p>}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-4">
            {ratings.map((rating: any) => (
              <Card key={rating.id} className="card-premium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PremiumAvatar name={rating.client?.user?.fullName || 'Client'} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{rating.client?.user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(rating.createdAt)}</p>
                      </div>
                    </div>
                    <RatingStars rating={rating.overallRating} size="sm" />
                  </div>
                  {rating.reviewText && <p className="text-sm text-muted-foreground mt-3">{rating.reviewText}</p>}
                </CardContent>
              </Card>
            ))}
            {ratings.length === 0 && <p className="text-muted-foreground text-center py-8">No reviews yet</p>}
          </div>
        </TabsContent>

        <TabsContent value="certificates">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert: any) => (
              <Card key={cert.id} className="card-premium">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {cert.certificateThumbnailUrl ? (
                      <img src={cert.certificateThumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Award className="h-8 w-8 text-muted-foreground/30" /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{cert.certificateName}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuingOrganization}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(cert.dateIssued)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certificates.length === 0 && <p className="text-muted-foreground text-center py-8 col-span-full">No certificates uploaded</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}