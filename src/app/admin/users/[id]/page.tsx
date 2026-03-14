'use client';

import { useParams } from 'next/navigation';
import {
  useAdminUserDetail,
  useSuspendUser,
  useReactivateUser,
  useResetUserPassword,
  useToggleMemberFeatured,
} from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { BackButton } from '@/components/shared/back-button';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatPhoneNumber, formatNumber } from '@/lib/format';
import { getProviderTypeLabel, getProviderTypeDisplay } from '@/lib/constants';
import {
  MapPin, Phone, Mail, Calendar, Star,
  Package, Wrench, Hammer, Award, Eye, DollarSign,
  Ban, RotateCcw, KeyRound, Loader2,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useAdminUserDetail(id as string);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendForm, setShowSuspendForm] = useState(false);

  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();
  const resetPassword = useResetUserPassword();
  const featureMember = useToggleMemberFeatured();

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const user = data?.data;
  if (!user) return <div className="text-center py-20">User not found</div>;

  const mp = user.memberProfile;

  return (
    <div className="space-y-6">
      <BackButton href="/admin/users" label="Back to Users" />

      {/* Header Card */}
      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-amber-400 to-blue-400" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <PremiumAvatar
              name={user.fullName}
              src={mp?.profilePhotoUrl}
              size="xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-heading font-bold">{user.fullName}</h1>
                <StatusBadge status={user.verificationStatus} />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary" />
                  {formatPhoneNumber(user.phoneNumber)}
                </span>
                {user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-primary" />
                    {user.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Joined {formatDate(user.createdAt)}
                </span>
                {mp?.state && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {mp.localGovernmentArea}, {mp.state}
                  </span>
                )}
              </div>
              {mp && (
                <div className="flex items-center gap-3 mt-3">
                  {/* FIX: Use helper function instead of rendering object directly */}
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {getProviderTypeDisplay(mp.providerType)}
                  </span>
                  <RatingStars
                    rating={Number(mp.averageRating)}
                    size="sm"
                    showValue
                    totalRatings={mp.totalRatings}
                  />
                  {mp.isFeatured && (
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              {user.userType === 'MEMBER' && mp && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => featureMember.mutate(mp.id)}
                  disabled={featureMember.isPending}
                >
                  <Star className="h-4 w-4 mr-1.5" />
                  {mp.isFeatured ? 'Unfeature' : 'Feature'}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => resetPassword.mutate({ userId: user.id, newPassword: 'TempPass@2025' })}
                disabled={resetPassword.isPending}
              >
                {resetPassword.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4 mr-1.5" />
                )}
                Reset Password
              </Button>
              {user.verificationStatus === 'SUSPENDED' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-emerald-600 border-emerald-200"
                  onClick={() => reactivateUser.mutate(user.id)}
                  disabled={reactivateUser.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reactivate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-destructive border-destructive/20"
                  onClick={() => setShowSuspendForm(!showSuspendForm)}
                >
                  <Ban className="h-4 w-4 mr-1.5" />
                  Suspend
                </Button>
              )}
            </div>
          </div>

          {/* Suspend form */}
          {showSuspendForm && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm mb-2"
                placeholder="Reason for suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  suspendUser.mutate({ userId: user.id, reason: suspendReason });
                  setShowSuspendForm(false);
                }}
                disabled={!suspendReason || suspendUser.isPending}
              >
                {suspendUser.isPending && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                Confirm Suspension
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats for Members */}
      {mp && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: 'Products', value: mp.totalProducts, icon: Package, gradient: 'from-primary to-emerald-600' },
            { label: 'Services', value: mp.totalServices, icon: Wrench, gradient: 'from-blue-500 to-blue-600' },
            { label: 'Tools', value: mp.totalTools, icon: Hammer, gradient: 'from-amber-500 to-amber-600' },
            { label: 'Certificates', value: mp.totalCertificates, icon: Award, gradient: 'from-violet-500 to-violet-600' },
            { label: 'Rating', value: Number(mp.averageRating).toFixed(1), icon: Star, gradient: 'from-amber-400 to-amber-500' },
            { label: 'Views', value: formatNumber(mp.profileViewCount), icon: Eye, gradient: 'from-emerald-500 to-primary' },
            { label: 'Transactions', value: mp.totalTransactions, icon: DollarSign, gradient: 'from-blue-400 to-blue-500' },
          ].map((stat) => (
            <Card key={stat.label} className="rounded-2xl border-border/50">
              <CardContent className="p-4 text-center">
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-xl font-heading font-bold">{stat.value ?? 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="rounded-xl">
          <TabsTrigger value="info" className="rounded-lg">Profile Info</TabsTrigger>
          {mp && <TabsTrigger value="specializations" className="rounded-lg">Specializations</TabsTrigger>}
          <TabsTrigger value="login" className="rounded-lg">Login History</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoItem label="User ID"><code className="text-xs bg-muted px-2 py-0.5 rounded">{user.id}</code></InfoItem>
              <InfoItem label="Phone">{formatPhoneNumber(user.phoneNumber)}</InfoItem>
              <InfoItem label="Email">{user.email || 'N/A'}</InfoItem>
              <InfoItem label="Type">{user.userType}</InfoItem>
              <InfoItem label="Account Active">{user.isActive ? 'Yes' : 'No'}</InfoItem>
              <InfoItem label="Last Login">{formatDate(user.lastLoginAt) || 'Never'}</InfoItem>
              <InfoItem label="Login Count">{String(user.loginCount || 0)}</InfoItem>
              <InfoItem label="Last Login IP">{user.lastLoginIp || 'N/A'}</InfoItem>
              {mp && (
                <>
                  <InfoItem label="Provider Type">{getProviderTypeLabel(mp.providerType)}</InfoItem>
                  <InfoItem label="Address">{mp.address}</InfoItem>
                  <InfoItem label="Bio">{mp.bio || 'N/A'}</InfoItem>
                  <InfoItem label="Years of Experience">{String(mp.yearsOfExperience || 'N/A')}</InfoItem>
                  <InfoItem label="Profile Completeness">{`${mp.profileCompleteness || 0}%`}</InfoItem>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {mp && (
          <TabsContent value="specializations" className="mt-4">
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-6">
                {mp.specializations?.length > 0 ? (
                  <div className="space-y-3">
                    {mp.specializations.map((spec: any) => (
                      <div key={spec.id} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{spec.category?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {spec.specializationType} • {spec.experienceYears || 0} years
                            </p>
                          </div>
                          {spec.isPrimary && (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        {spec.specificSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {spec.specificSkills.map((skill: string, i: number) => (
                              <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No specializations added</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="login" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Total Logins"><span className="text-2xl font-bold">{String(user.loginCount || 0)}</span></InfoItem>
                <InfoItem label="Failed Attempts"><span className="text-2xl font-bold">{String(user.failedLoginAttempts || 0)}</span></InfoItem>
                <InfoItem label="Last Login">{formatDate(user.lastLoginAt) || 'Never'}</InfoItem>
                <InfoItem label="Last IP">{user.lastLoginIp || 'N/A'}</InfoItem>
                <InfoItem label="Locked Until">{user.lockedUntil ? formatDate(user.lockedUntil) : 'Not locked'}</InfoItem>
                <InfoItem label="Created At">{formatDate(user.createdAt)}</InfoItem>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Small helper to avoid repeating markup */
function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-muted-foreground block text-xs mb-0.5">{label}</span>
      <strong>{children}</strong>
    </div>
  );
}