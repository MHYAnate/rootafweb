'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatRelativeTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
  Users,
  Clock,
  Package,
  Wrench,
  Hammer,
  Star,
  Calendar,
  Heart,
  AlertTriangle,
  KeyRound,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading dashboard..."
        className="py-24"
      />
    );
  }

  const counts = data?.data?.counts || {};
  const recentUsers = data?.data?.recentUsers || [];
  const recentActivity = data?.data?.recentActivity || [];

  const statCards = [
    {
      label: 'Total Users',
      value: counts.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Members',
      value: counts.totalMembers,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Clients',
      value: counts.totalClients,
      icon: Users,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Pending',
      value: counts.pendingVerifications,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/verifications',
      urgent: counts.pendingVerifications > 0,
    },
    {
      label: 'Resets',
      value: counts.pendingPasswordResets,
      icon: KeyRound,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/admin/password-resets',
    },
    {
      label: 'Products',
      value: counts.totalProducts,
      icon: Package,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Services',
      value: counts.totalServices,
      icon: Wrench,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Tools',
      value: counts.totalTools,
      icon: Hammer,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      label: 'Ratings',
      value: counts.totalRatings,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Events',
      value: counts.totalEvents,
      icon: Calendar,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      label: 'Sponsors',
      value: counts.totalSponsors,
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Suspended',
      value: counts.suspendedUsers,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your platform
          </p>
        </div>
        {counts.pendingVerifications > 0 && (
          <Link href="/admin/verifications">
            <Button className="btn-premium rounded-xl gap-2 animate-glow">
              <Clock className="h-4 w-4" />
              {counts.pendingVerifications} Pending
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => {
          const Wrapper = stat.href ? Link : 'div';
          const props = stat.href ? { href: stat.href } : {};
          return (
            <Wrapper key={stat.label} {...(props as any)}>
              <Card
                className={`${stat.href ? 'card-premium cursor-pointer' : 'card-premium'} ${stat.urgent ? 'ring-2 ring-amber-300/50' : ''} animate-fade-up`}
                style={{
                  animationDelay: `${idx * 0.03}s`,
                }}
              >
                <CardContent className="p-4">
                  <div
                    className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
                  >
                    <stat.icon
                      className={`h-4.5 w-4.5 ${stat.color}`}
                    />
                  </div>
                  <div className="text-2xl font-bold">
                    {stat.value || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </Wrapper>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">
              Recent Registrations
            </CardTitle>
            <Link href="/admin/users">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg gap-1 text-xs"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between text-sm p-3 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.userType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={user.verificationStatus}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(user.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">
              Recent Activity
            </CardTitle>
            <Link href="/admin/activity-log">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg gap-1 text-xs"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((log: any) => (
                <div
                  key={log.id}
                  className="text-sm p-3 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <p className="font-medium">
                    {log.actionDescription}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>by {log.admin?.fullName}</span>
                    <span>•</span>
                    <span>
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}