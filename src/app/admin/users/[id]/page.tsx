// 'use client';

// import { useParams } from 'next/navigation';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { adminApi } from '@/lib/api/admin.api';
// import { BackButton } from '@/components/shared/back-button';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { StatusBadge } from '@/components/shared/status-badge';
// import { PremiumAvatar } from '@/components/shared/premium-avatar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { formatDate, formatPhoneNumber } from '@/lib/format';
// import { Ban, RefreshCw, Loader2 } from 'lucide-react';

// export default function AdminUserDetailPage() {
//   const { id } = useParams();
//   const qc = useQueryClient();
//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-user', id],
//     queryFn: () => adminApi.getUserById(id as string),
//     enabled: !!id,
//   });

//   const suspendMutation = useMutation({
//     mutationFn: () => adminApi.suspendUser(id as string, 'Admin action'),
//     onSuccess: () => { toast.success('User suspended'); qc.invalidateQueries({ queryKey: ['admin-user', id] }); },
//   });

//   const reactivateMutation = useMutation({
//     mutationFn: () => adminApi.reactivateUser(id as string),
//     onSuccess: () => { toast.success('User reactivated'); qc.invalidateQueries({ queryKey: ['admin-user', id] }); },
//   });

//   if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
//   const user = data?.data;
//   if (!user) return <div>User not found</div>;

//   return (
//     <div className="space-y-6">
//       <BackButton href="/admin/users" />
//       <PageHeader title={user.fullName} />

//       <Card className="card-gold">
//         <CardContent className="p-6">
//           <div className="flex items-start gap-4">
//             <PremiumAvatar name={user.fullName} size="xl" verified={user.verificationStatus === 'VERIFIED'} />
//             <div className="space-y-2 text-sm">
//               <p><strong>Phone:</strong> {formatPhoneNumber(user.phoneNumber)}</p>
//               <p><strong>Email:</strong> {user.email || 'N/A'}</p>
//               <p><strong>Type:</strong> {user.userType}</p>
//               <p><strong>Status:</strong> <StatusBadge status={user.verificationStatus} /></p>
//               <p><strong>Joined:</strong> {formatDate(user.createdAt)}</p>
//               <p><strong>Last Login:</strong> {formatDate(user.lastLoginAt)}</p>
//               <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="card-premium">
//         <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
//         <CardContent className="flex gap-3">
//           {user.isActive ? (
//             <Button variant="destructive" className="rounded-xl gap-2" onClick={() => suspendMutation.mutate()} disabled={suspendMutation.isPending}>
//               {suspendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}Suspend User
//             </Button>
//           ) : (
//             <Button className="btn-premium rounded-xl gap-2" onClick={() => reactivateMutation.mutate()} disabled={reactivateMutation.isPending}>
//               {reactivateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Reactivate User
//             </Button>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatPhoneNumber, formatCurrency, formatNumber } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import {
  User, MapPin, Phone, Mail, Calendar, Shield, Star,
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
  const cp = user.clientProfile;

  return (
    <div className="space-y-6">
      <BackButton href="/admin/users" label="Back to Users" />

      {/* Header Card */}
      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-gold-400 to-royal-400" />
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
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" />{formatPhoneNumber(user.phoneNumber)}</span>
                {user.email && <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" />{user.email}</span>}
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />Joined {formatDate(user.createdAt)}</span>
                {mp?.state && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{mp.localGovernmentArea}, {mp.state}</span>}
              </div>
              {mp && (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                    {PROVIDER_TYPE_MAP[mp.providerType] as any}
                  </span>
                  <RatingStars rating={Number(mp.averageRating)} size="sm" showValue totalRatings={mp.totalRatings} />
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
                {resetPassword.isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <KeyRound className="h-4 w-4 mr-1.5" />}
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
            { label: 'Services', value: mp.totalServices, icon: Wrench, gradient: 'from-royal-500 to-royal-600' },
            { label: 'Tools', value: mp.totalTools, icon: Hammer, gradient: 'from-gold-500 to-gold-600' },
            { label: 'Certificates', value: mp.totalCertificates, icon: Award, gradient: 'from-violet-500 to-violet-600' },
            { label: 'Rating', value: Number(mp.averageRating).toFixed(1), icon: Star, gradient: 'from-gold-400 to-gold-500' },
            { label: 'Profile Views', value: formatNumber(mp.profileViewCount), icon: Eye, gradient: 'from-emerald-500 to-primary' },
            { label: 'Transactions', value: mp.totalTransactions, icon: DollarSign, gradient: 'from-royal-400 to-royal-500' },
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

      {/* User Details Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="rounded-xl">
          <TabsTrigger value="info" className="rounded-lg">Profile Info</TabsTrigger>
          {mp && <TabsTrigger value="specializations" className="rounded-lg">Specializations</TabsTrigger>}
          <TabsTrigger value="login" className="rounded-lg">Login History</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground block text-xs mb-0.5">User ID</span><code className="text-xs bg-muted px-2 py-0.5 rounded">{user.id}</code></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Phone</span><strong>{formatPhoneNumber(user.phoneNumber)}</strong></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Email</span><strong>{user.email || 'N/A'}</strong></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Type</span><strong>{user.userType}</strong></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Account Active</span><strong>{user.isActive ? 'Yes' : 'No'}</strong></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Last Login</span><strong>{formatDate(user.lastLoginAt) || 'Never'}</strong></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Login Count</span><strong>{user.loginCount}</strong></div>
              <div><span className="text-muted-foreground block text-xs mb-0.5">Last Login IP</span><strong>{user.lastLoginIp || 'N/A'}</strong></div>
              {mp && (
                <>
                  <div><span className="text-muted-foreground block text-xs mb-0.5">Address</span><strong>{mp.address}</strong></div>
                  <div><span className="text-muted-foreground block text-xs mb-0.5">Bio</span><strong>{mp.bio || 'N/A'}</strong></div>
                  <div><span className="text-muted-foreground block text-xs mb-0.5">Years of Experience</span><strong>{mp.yearsOfExperience || 'N/A'}</strong></div>
                  <div><span className="text-muted-foreground block text-xs mb-0.5">Profile Completeness</span><strong>{mp.profileCompleteness}%</strong></div>
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
                            <p className="text-xs text-muted-foreground">{spec.specializationType} • {spec.experienceYears || 0} years</p>
                          </div>
                          {spec.isPrimary && (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Primary</span>
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
                <div><span className="text-muted-foreground block text-xs mb-0.5">Total Logins</span><strong className="text-2xl">{user.loginCount || 0}</strong></div>
                <div><span className="text-muted-foreground block text-xs mb-0.5">Failed Attempts</span><strong className="text-2xl">{user.failedLoginAttempts || 0}</strong></div>
                <div><span className="text-muted-foreground block text-xs mb-0.5">Last Login</span><strong>{formatDate(user.lastLoginAt) || 'Never'}</strong></div>
                <div><span className="text-muted-foreground block text-xs mb-0.5">Last IP</span><strong>{user.lastLoginIp || 'N/A'}</strong></div>
                <div><span className="text-muted-foreground block text-xs mb-0.5">Account Locked Until</span><strong>{user.lockedUntil ? formatDate(user.lockedUntil) : 'Not locked'}</strong></div>
                <div><span className="text-muted-foreground block text-xs mb-0.5">Created At</span><strong>{formatDate(user.createdAt)}</strong></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}