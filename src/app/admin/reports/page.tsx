'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Download,
  Users,
  Package,
  Wrench,
  Hammer,
  Star,
  DollarSign,
  Calendar,
  Heart,
} from 'lucide-react';

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
  });

  const handleExportUsers = async () => {
    try {
      const res = await adminApi.exportUsers();
      // Assuming the API returns a blob or data URL; we'll create a download link
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  const handleExportTransactions = async () => {
    try {
      const res = await adminApi.exportTransactions();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const counts = data?.data?.counts || {};
  const trends = data?.data?.trends || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="View platform statistics and export data"
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{counts.totalUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{counts.totalProducts}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Wrench className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <p className="text-2xl font-bold">{counts.totalServices}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Hammer className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Tools</p>
                  <p className="text-2xl font-bold">{counts.totalTools}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Ratings</p>
                  <p className="text-2xl font-bold">{counts.totalRatings}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{counts.totalTransactions}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-2xl font-bold">{counts.totalEvents}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Heart className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Sponsors</p>
                  <p className="text-2xl font-bold">{counts.totalSponsors}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">New Users (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{trends.newUsersToday || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">New Users (This Week)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{trends.newUsersThisWeek || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">New Users (This Month)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{trends.newUsersThisMonth || 0}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          {/* Breakdowns from dashboard data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Members by State</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.data?.breakdowns?.membersByState?.length ? (
                  <ul className="space-y-2">
                    {data.data.breakdowns.membersByState.map((item: any) => (
                      <li key={item.state} className="flex justify-between">
                        <span>{item.state}</span>
                        <span className="font-semibold">{item._count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No data</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Members by Type</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.data?.breakdowns?.membersByType?.length ? (
                  <ul className="space-y-2">
                    {data.data.breakdowns.membersByType.map((item: any) => (
                      <li key={item.providerType} className="flex justify-between">
                        <span>{item.providerType}</span>
                        <span className="font-semibold">{item._count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No data</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{counts.totalProducts}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  New this week: {trends.newProductsThisWeek || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{counts.totalServices}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  New this week: {trends.newServicesThisWeek || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{counts.totalTools}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Users</p>
                  <p className="text-sm text-muted-foreground">Download all user data as JSON</p>
                </div>
                <Button onClick={handleExportUsers} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Transactions</p>
                  <p className="text-sm text-muted-foreground">Download transaction records as JSON</p>
                </div>
                <Button onClick={handleExportTransactions} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}