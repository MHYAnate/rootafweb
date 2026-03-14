// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { adminApi } from '@/lib/api/admin.api';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   BarChart3,
//   Download,
//   Users,
//   Package,
//   Wrench,
//   Hammer,
//   Star,
//   DollarSign,
//   Calendar,
//   Heart,
// } from 'lucide-react';

// export default function ReportsPage() {
//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-dashboard'],
//     queryFn: adminApi.getDashboard,
//   });

//   const handleExportUsers = async () => {
//     try {
//       const res = await adminApi.exportUsers();
//       // Assuming the API returns a blob or data URL; we'll create a download link
//       const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Export failed', error);
//     }
//   };

//   const handleExportTransactions = async () => {
//     try {
//       const res = await adminApi.exportTransactions();
//       const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.json`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Export failed', error);
//     }
//   };

//   if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

//   const counts = data?.data?.counts || {};
//   const trends = data?.data?.trends || {};

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Reports & Analytics"
//         description="View platform statistics and export data"
//       />

//       <Tabs defaultValue="overview">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="users">Users</TabsTrigger>
//           <TabsTrigger value="listings">Listings</TabsTrigger>
//           <TabsTrigger value="exports">Exports</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4 mt-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Users className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Users</p>
//                   <p className="text-2xl font-bold">{counts.totalUsers}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Package className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Products</p>
//                   <p className="text-2xl font-bold">{counts.totalProducts}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Wrench className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Services</p>
//                   <p className="text-2xl font-bold">{counts.totalServices}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Hammer className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Tools</p>
//                   <p className="text-2xl font-bold">{counts.totalTools}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Star className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Ratings</p>
//                   <p className="text-2xl font-bold">{counts.totalRatings}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <DollarSign className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Transactions</p>
//                   <p className="text-2xl font-bold">{counts.totalTransactions}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Calendar className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Events</p>
//                   <p className="text-2xl font-bold">{counts.totalEvents}</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Heart className="h-8 w-8 text-primary" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Sponsors</p>
//                   <p className="text-2xl font-bold">{counts.totalSponsors}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">New Users (Today)</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{trends.newUsersToday || 0}</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">New Users (This Week)</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{trends.newUsersThisWeek || 0}</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">New Users (This Month)</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{trends.newUsersThisMonth || 0}</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="users" className="space-y-4 mt-4">
//           {/* Breakdowns from dashboard data */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Members by State</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {data?.data?.breakdowns?.membersByState?.length ? (
//                   <ul className="space-y-2">
//                     {data.data.breakdowns.membersByState.map((item: any) => (
//                       <li key={item.state} className="flex justify-between">
//                         <span>{item.state}</span>
//                         <span className="font-semibold">{item._count}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-muted-foreground">No data</p>
//                 )}
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Members by Type</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {data?.data?.breakdowns?.membersByType?.length ? (
//                   <ul className="space-y-2">
//                     {data.data.breakdowns.membersByType.map((item: any) => (
//                       <li key={item.providerType} className="flex justify-between">
//                         <span>{item.providerType}</span>
//                         <span className="font-semibold">{item._count}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-muted-foreground">No data</p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="listings" className="space-y-4 mt-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Products</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{counts.totalProducts}</p>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   New this week: {trends.newProductsThisWeek || 0}
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Services</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{counts.totalServices}</p>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   New this week: {trends.newServicesThisWeek || 0}
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Tools</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{counts.totalTools}</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="exports" className="space-y-4 mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Export Data</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Export Users</p>
//                   <p className="text-sm text-muted-foreground">Download all user data as JSON</p>
//                 </div>
//                 <Button onClick={handleExportUsers} variant="outline">
//                   <Download className="mr-2 h-4 w-4" />
//                   Export
//                 </Button>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Export Transactions</p>
//                   <p className="text-sm text-muted-foreground">Download transaction records as JSON</p>
//                 </div>
//                 <Button onClick={handleExportTransactions} variant="outline">
//                   <Download className="mr-2 h-4 w-4" />
//                   Export
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
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