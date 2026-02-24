'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useMyReceivedRatings, useMyGivenRatings } from '@/hooks/use-ratings';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { Star } from 'lucide-react';

export default function MyRatingsPage() {
  const { isMember } = useCurrentUser();
  const { data: receivedData, isLoading: loadingReceived } = useMyReceivedRatings();
  const { data: givenData, isLoading: loadingGiven } = useMyGivenRatings();

  return (
    <div className="space-y-6">
      <PageHeader title="My Ratings" />
      <Tabs defaultValue={isMember ? 'received' : 'given'}>
        <TabsList className="rounded-xl bg-muted/50 p-1">
          {isMember && <TabsTrigger value="received" className="rounded-lg">Received</TabsTrigger>}
          <TabsTrigger value="given" className="rounded-lg">Given</TabsTrigger>
        </TabsList>
        {isMember && (
          <TabsContent value="received">
            {loadingReceived ? <LoadingSpinner size="lg" className="py-16" /> : receivedData?.data?.length === 0 ? (
              <EmptyState icon={Star} title="No ratings received yet" />
            ) : (
              <div className="space-y-4 mt-4">
                {receivedData?.data?.map((r: any) => (
                  <Card key={r.id} className="card-premium">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PremiumAvatar name={r.client?.user?.fullName || 'Client'} size="sm" />
                          <div><p className="text-sm font-medium">{r.client?.user?.fullName}</p><p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p></div>
                        </div>
                        <RatingStars rating={r.overallRating} size="sm" />
                      </div>
                      {r.reviewText && <p className="text-sm text-muted-foreground mt-3">{r.reviewText}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
        <TabsContent value="given">
          {loadingGiven ? <LoadingSpinner size="lg" className="py-16" /> : givenData?.data?.length === 0 ? (
            <EmptyState icon={Star} title="No ratings given yet" />
          ) : (
            <div className="space-y-4 mt-4">
              {givenData?.data?.map((r: any) => (
                <Card key={r.id} className="card-premium">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium">{r.member?.user?.fullName}</p><p className="text-xs text-muted-foreground">{r.ratingCategory?.replace(/_/g, ' ')}</p></div>
                      <RatingStars rating={r.overallRating} size="sm" />
                    </div>
                    {r.reviewText && <p className="text-sm text-muted-foreground mt-3">{r.reviewText}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}