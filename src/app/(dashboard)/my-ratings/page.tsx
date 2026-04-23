// src/app/(main)/my-ratings/page.tsx
'use client';

import { useState } from 'react';
import { useMyRatingsGiven, useMyRatingsReceived } from '@/hooks/use-ratings';
import { RatingCard } from '@/components/ratings/rating-card';
import { RatingSummary } from '@/components/ratings/rating-summary';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/use-auth';
import {
  Star,
  Send,
  Inbox,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

// ── Given Tab ─────────────────────────────────────────────────────────────────

function GivenRatings() {
  const { data, isLoading } = useMyRatingsGiven();
  const ratings = data?.data ?? [];

  if (isLoading) return <LoadingSpinner text="Loading…" className="py-12" />;

  if (ratings.length === 0) {
    return (
      <div className="flex flex-col items-center py-14 text-center gap-3 text-muted-foreground">
        <Send className="h-10 w-10 opacity-30" />
        <p className="font-medium">No ratings given yet</p>
        <p className="text-sm">
          Visit a member's profile to leave your first review.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ratings.map((r) => (
        <RatingCard key={r.id} rating={r} showMember showReviewer={false} />
      ))}
    </div>
  );
}

// ── Received Tab ──────────────────────────────────────────────────────────────

function ReceivedRatings() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useMyRatingsReceived(page);
  const { data: profileData } = useProfile();
  const member = profileData?.data?.memberProfile;

  const ratings = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) return <LoadingSpinner text="Loading…" className="py-12" />;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {member && Number(member.totalRatings) > 0 && (
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-base">Your Rating Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingSummary
              averageRating={Number(member.averageRating)}
              totalRatings={Number(member.totalRatings)}
              oneStarCount={member.oneStarCount ?? 0}
              twoStarCount={member.twoStarCount ?? 0}
              threeStarCount={member.threeStarCount ?? 0}
              fourStarCount={member.fourStarCount ?? 0}
              fiveStarCount={member.fiveStarCount ?? 0}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {ratings.length === 0 && (
        <div className="flex flex-col items-center py-14 text-center gap-3 text-muted-foreground">
          <Inbox className="h-10 w-10 opacity-30" />
          <p className="font-medium">No reviews received yet</p>
          <p className="text-sm">
            Clients who transact with you can leave reviews here.
          </p>
        </div>
      )}

      {/* Cards */}
      {ratings.length > 0 && (
        <div
          className={`grid gap-4 sm:grid-cols-2 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
        >
          {ratings.map((r) => (
            <RatingCard key={r.id} rating={r} showReviewer />
          ))}
        </div>
      )}

      {/* Pagination */}
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
            {meta.page} / {meta.totalPages}
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
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyRatingsPage() {
  const { user } = useAuthStore();
  const isMember = user?.userType === 'MEMBER';

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Star className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ratings & Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Manage your ratings and reviews
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={isMember ? 'received' : 'given'}>
        <TabsList className="rounded-xl">
          {isMember && (
            <TabsTrigger value="received" className="rounded-lg gap-1.5">
              <Inbox className="h-4 w-4" />
              Received
            </TabsTrigger>
          )}
          <TabsTrigger value="given" className="rounded-lg gap-1.5">
            <Send className="h-4 w-4" />
            Given
          </TabsTrigger>
        </TabsList>

        {isMember && (
          <TabsContent value="received" className="mt-6">
            <ReceivedRatings />
          </TabsContent>
        )}

        <TabsContent value="given" className="mt-6">
          <GivenRatings />
        </TabsContent>
      </Tabs>
    </div>
  );
}