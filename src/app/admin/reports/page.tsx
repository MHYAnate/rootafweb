'use client';

import { useAdminDashboard, useExportUsers, useExportTransactions } from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, Users, Package, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminReportsPage() {
  const { data, isLoading } = useAdminDashboard();
  const exportUsers = useExportUsers();
  const exportTransactions = useExportTransactions();
  const [exportType, setExportType] = useState('');

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const { counts, trends, breakdowns } = data?.data || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Platform analytics and data export"
        badge="Analytics"
      />

      {/* Export Section */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => exportUsers.mutate({})}
              disabled={exportUsers.isPending}
            >
              {exportUsers.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
              Export All Users
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => exportUsers.mutate({ userType: 'MEMBER' })}
              disabled={exportUsers.isPending}
            >
              <Users className="mr-2 h-4 w-4" />
              Export Members
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => exportUsers.mutate({ userType: 'CLIENT' })}
              disabled={exportUsers.isPending}
            >
              <Users className="mr-2 h-4 w-4" />
              Export Clients
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => exportTransactions.mutate({})}
              disabled={exportTransactions.isPending}
            >
              {exportTransactions.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
              Export Transactions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-emerald-50">
          <CardContent className="p-5">
            <Users className="h-6 w-6 text-primary mb-2" />
            <div className="text-3xl font-heading font-bold">{counts?.totalUsers || 0}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-xs text-primary font-medium mt-1">+{trends?.newUsersThisMonth || 0} this month</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-royal-50 to-royal-100/50">
          <CardContent className="p-5">
            <Package className="h-6 w-6 text-royal-600 mb-2" />
            <div className="text-3xl font-heading font-bold">{counts?.totalProducts || 0}</div>
            <p className="text-sm text-muted-foreground">Active Products</p>
            <p className="text-xs text-royal-600 font-medium mt-1">+{trends?.newProductsThisWeek || 0} this week</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-gold-50 to-gold-100/50">
          <CardContent className="p-5">
            <DollarSign className="h-6 w-6 text-gold-600 mb-2" />
            <div className="text-3xl font-heading font-bold">{counts?.totalTransactions || 0}</div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-5">
            <TrendingUp className="h-6 w-6 text-emerald-600 mb-2" />
            <div className="text-3xl font-heading font-bold">{counts?.verifiedMembers || 0}</div>
            <p className="text-sm text-muted-foreground">Verified Members</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {counts?.totalMembers ? Math.round((counts.verifiedMembers / counts.totalMembers) * 100) : 0}% verification rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {breakdowns?.membersByState && (
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Members by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breakdowns.membersByState.map((item: any, i: number) => {
                  const max = breakdowns.membersByState[0]?._count || 1;
                  return (
                    <div key={item.state} className="flex items-center gap-3">
                      <span className="w-6 text-xs text-muted-foreground text-right">{i + 1}</span>
                      <span className="w-24 text-sm font-medium truncate">{item.state}</span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(10, (item._count / max) * 100)}%` }}
                        >
                          <span className="text-[10px] text-white font-bold">{item._count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {breakdowns?.membersByType && (
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Member Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {breakdowns.membersByType.map((item: any) => {
                  const total = breakdowns.membersByType.reduce((s: number, i: any) => s + i._count, 0);
                  const pct = total ? Math.round((item._count / total) * 100) : 0;
                  const colors: Record<string, string> = {
                    FARMER: 'from-emerald-500 to-emerald-600',
                    ARTISAN: 'from-royal-500 to-royal-600',
                    BOTH: 'from-gold-500 to-gold-600',
                  };
                  return (
                    <div key={item.providerType}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.providerType}</span>
                        <span className="text-sm font-bold">{item._count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors[item.providerType] || 'from-gray-400 to-gray-500'} rounded-full`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}