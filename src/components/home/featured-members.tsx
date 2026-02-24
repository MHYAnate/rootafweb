'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { membersApi } from '@/lib/api/members.api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/shared/rating-stars';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { MapPin, ArrowRight, Award, Sparkles } from 'lucide-react';

export function FeaturedMembers() {
  const { data } = useQuery({
    queryKey: ['featured-members'],
    queryFn: () =>
      membersApi.getAll({
        limit: 4,
        sortBy: 'rating',
        sortOrder: 'desc',
      }),
  });

  const members = data?.data || [];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/50 mb-4">
              <Award className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Top Rated
              </span>
            </div>
            <h2 className="section-title">Featured Members</h2>
            <p className="section-description">
              Our highest-rated farmers and artisans
            </p>
          </div>
          <Link href="/members" className="hidden sm:block">
            <Button variant="outline" className="rounded-xl gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member: any, idx: number) => {
            const providerInfo =
              PROVIDER_TYPE_MAP[member.providerType];
            return (
              <Link
                key={member.id}
                href={`/members/${member.id}`}
              >
                <Card
                  className="card-gold h-full animate-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {/* Gold Crown for Top Member */}
                      {idx === 0 && (
                        <div className="mb-2">
                          <Sparkles className="h-5 w-5 text-amber-400" />
                        </div>
                      )}

                      <PremiumAvatar
                        src={member.profilePhotoThumbnail}
                        name={member.user?.fullName || ''}
                        size="lg"
                        verified
                      />

                      <h3 className="font-semibold mt-4">
                        {member.user?.fullName}
                      </h3>

                      <span className="text-xs font-medium text-primary mt-1 flex items-center gap-1">
                        <span>{providerInfo?.icon}</span>
                        {providerInfo?.label}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <MapPin className="h-3 w-3" />
                        {member.localGovernmentArea}, {member.state}
                      </div>

                      {member.tagline && (
                        <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                          {member.tagline}
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-border/50 w-full">
                        <RatingStars
                          rating={Number(member.averageRating)}
                          size="sm"
                          showValue
                          totalRatings={member.totalRatings}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/members">
            <Button variant="outline" className="rounded-xl gap-2">
              View All Members
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}