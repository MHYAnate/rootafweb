'use client';

import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Wrench,
  Hammer,
  Star,
  Eye,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  const memberProfile = profile?.memberProfile;

  const statCards = [
    {
      label: 'Products',
      value: memberProfile?.totalProducts || 0,
      icon: Package,
      href: '/my-products',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Services',
      value: memberProfile?.totalServices || 0,
      icon: Wrench,
      href: '/my-services',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tools',
      value: memberProfile?.totalTools || 0,
      icon: Hammer,
      href: '/my-tools',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Rating',
      value: Number(memberProfile?.averageRating || 0).toFixed(1),
      icon: Star,
      href: '/my-ratings',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Profile Views',
      value: memberProfile?.profileViewCount || 0,
      icon: Eye,
      href: '#',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      label: 'Transactions',
      value: memberProfile?.totalTransactions || 0,
      icon: DollarSign,
      href: '/my-transactions',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="absolute inset-0 dot-pattern opacity-[0.04]" />
        <div className="absolute top-4 right-4 animate-float opacity-20">
          <Sparkles className="h-16 w-16 text-amber-300" />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-green-100/80">Account Status:</span>
            <StatusBadge
              status={user?.verificationStatus || 'PENDING'}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {user?.userType === 'MEMBER' && memberProfile && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, idx) => (
            <Link key={stat.label} href={stat.href}>
              <Card
                className="card-premium animate-fade-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <CardContent className="p-5 text-center">
                  <div
                    className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}
                  >
                    <stat.icon
                      className={`h-5 w-5 ${stat.color}`}
                    />
                  </div>
                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="card-premium">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {user?.userType === 'MEMBER' && (
            <>
              <Link href="/my-products/new">
                <Button className="btn-premium rounded-xl gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
              <Link href="/my-services/new">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Service
                </Button>
              </Link>
              <Link href="/my-tools/new">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  <Plus className="h-4 w-4" />
                  List Tool
                </Button>
              </Link>
              <Link href="/my-certificates/new">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  Upload Certificate
                </Button>
              </Link>
            </>
          )}
          <Link href="/profile/edit">
            <Button variant="outline" className="rounded-xl gap-2">
              Edit Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}