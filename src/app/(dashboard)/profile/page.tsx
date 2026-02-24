'use client';

import { useMyProfile } from '@/hooks/use-members';
import { useCurrentUser } from '@/hooks/use-current-user';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { RatingStars } from '@/components/shared/rating-stars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { formatPhoneNumber } from '@/lib/format';
import { MapPin, Phone, Mail, Edit, Award } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isMember } = useCurrentUser();
  const { data, isLoading } = useMyProfile();

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const profile = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" action={
        <Link href="/profile/edit"><Button className="btn-premium rounded-xl gap-2"><Edit className="h-4 w-4" />Edit Profile</Button></Link>
      } />

      <Card className="card-gold">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <PremiumAvatar src={profile?.profilePhotoUrl} name={user?.fullName || ''} size="xl"
              verified={user?.verificationStatus === 'VERIFIED'} />
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                <StatusBadge status={user?.verificationStatus || 'PENDING'} />
              </div>
              {isMember && profile && (
                <p className="text-sm text-primary font-medium">{PROVIDER_TYPE_MAP[profile.providerType]?.icon} {PROVIDER_TYPE_MAP[profile.providerType]?.label}</p>
              )}
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{formatPhoneNumber(user?.phoneNumber || '')}</p>
                {user?.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{user.email}</p>}
                {profile?.state && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{profile.localGovernmentArea}, {profile.state}</p>}
              </div>
              {isMember && <RatingStars rating={Number(profile?.averageRating || 0)} showValue totalRatings={profile?.totalRatings} />}
            </div>
          </div>
          {profile?.bio && <p className="text-muted-foreground mt-6 pt-6 border-t">{profile.bio}</p>}
        </CardContent>
      </Card>
    </div>
  );
}