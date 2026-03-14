'use client';

import { useAdminDashboard } from '@/hooks/use-admin';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatsCards } from '@/components/admin/stats-cards';
import { RecentActivity } from '@/components/admin/recent-activity';
import { UserTable } from '@/components/admin/user-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatRelativeTime, formatNumber } from '@/lib/format';
import {
  Users, Clock, Package, Wrench, Hammer, Star, Calendar,
  Heart, AlertTriangle, KeyRound, Shield, TrendingUp,
  ArrowRight, BarChart3, Zap, Eye,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." className="py-20" />;
  }

  const { counts, trends, breakdowns, recentUsers, recentActivity } = data?.data || {};

  const mainStats = [
    { label: 'Total Users', value: counts?.totalUsers, icon: Users, gradient: 'from-royal-500 to-royal-600', trend: { value: trends?.newUsersToday || 0, label: 'today' } },
    { label: 'Members', value: counts?.totalMembers, icon: Users, gradient: 'from-primary to-emerald-600' },
    { label: 'Clients', value: counts?.totalClients, icon: Users, gradient: 'from-violet-500 to-violet-600' },
    { label: 'Pending', value: counts?.pendingVerifications, icon: Clock, gradient: 'from-gold-500 to-gold-600', href: '/admin/verifications', alert: (counts?.pendingVerifications || 0) > 0 },
    { label: 'PW Resets', value: counts?.pendingPasswordResets, icon: KeyRound, gradient: 'from-orange-500 to-orange-600', href: '/admin/password-resets', alert: (counts?.pendingPasswordResets || 0) > 0 },
    { label: 'Reports', value: counts?.pendingReports, icon: AlertTriangle, gradient: 'from-red-500 to-red-600', alert: (counts?.pendingReports || 0) > 0 },
  ];

  const listingStats = [
    { label: 'Products', value: counts?.totalProducts, icon: Package, gradient: 'from-emerald-500 to-emerald-600', trend: { value: trends?.newProductsThisWeek || 0, label: 'this week' } },
    { label: 'Services', value: counts?.totalServices, icon: Wrench, gradient: 'from-royal-400 to-royal-500', trend: { value: trends?.newServicesThisWeek || 0, label: 'this week' } },
    { label: 'Tools', value: counts?.totalTools, icon: Hammer, gradient: 'from-gold-400 to-gold-500' },
    { label: 'Ratings', value: counts?.totalRatings, icon: Star, gradient: 'from-gold-500 to-gold-600' },
    { label: 'Events', value: counts?.totalEvents, icon: Calendar, gradient: 'from-pink-500 to-pink-600' },
    { label: 'Sponsors', value: counts?.totalSponsors, icon: Heart, gradient: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          {(counts?.pendingVerifications || 0) > 0 && (
            <Link href="/admin/verifications">
              <Button className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-gold-900 shadow-md shadow-gold-500/20 animate-pulse">
                <Clock className="mr-2 h-4 w-4" />
                {counts.pendingVerifications} Pending
              </Button>
            </Link>
          )}
          <Link href="/admin/reports">
            <Button variant="outline" className="rounded-xl">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* User & Action Stats */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Users & Actions</h2>
        <StatsCards stats={mainStats} />
      </div>

      {/* Listing Stats */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Listings & Content</h2>
        <StatsCards stats={listingStats} />
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-emerald-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold">Today</h3>
            </div>
            <div className="text-3xl font-heading font-bold text-primary">{trends?.newUsersToday || 0}</div>
            <p className="text-sm text-muted-foreground">new registrations</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-royal-50 to-royal-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-royal-600" />
              <h3 className="font-heading font-semibold">This Week</h3>
            </div>
            <div className="text-3xl font-heading font-bold text-royal-600">{trends?.newUsersThisWeek || 0}</div>
            <p className="text-sm text-muted-foreground">new registrations</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-gold-50 to-gold-100/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-gold-600" />
              <h3 className="font-heading font-semibold">This Month</h3>
            </div>
            <div className="text-3xl font-heading font-bold text-gold-600">{trends?.newUsersThisMonth || 0}</div>
            <p className="text-sm text-muted-foreground">new registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg font-heading">Recent Registrations</CardTitle>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="rounded-xl text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentUsers || []).map((user: any) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{user.fullName?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.userType} • {user.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={user.verificationStatus} />
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(user.createdAt)}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivity || []} />
      </div>

      {/* Breakdowns */}
      {breakdowns?.membersByState && breakdowns.membersByState.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members by State */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Members by State (Top 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breakdowns.membersByState.map((item: any, i: number) => (
                  <div key={item.state} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-6">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.state}</span>
                        <span className="text-sm font-bold">{item._count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, (item._count / (breakdowns.membersByState[0]._count || 1)) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Members by Provider Type */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Members by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(breakdowns.membersByType || []).map((item: any) => {
                  const colors: Record<string, string> = {
                    FARMER: 'from-emerald-500 to-emerald-600',
                    ARTISAN: 'from-royal-500 to-royal-600',
                    BOTH: 'from-gold-500 to-gold-600',
                  };
                  const totalMembers = breakdowns.membersByType.reduce((sum: number, i: any) => sum + i._count, 0);
                  const percentage = totalMembers ? Math.round((item._count / totalMembers) * 100) : 0;

                  return (
                    <div key={item.providerType}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{item.providerType}</span>
                        <span className="text-sm">
                          <span className="font-bold">{item._count}</span>
                          <span className="text-muted-foreground ml-1">({percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors[item.providerType] || 'from-gray-400 to-gray-500'} rounded-full transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}