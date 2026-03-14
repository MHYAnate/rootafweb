// // 'use client';

// // import { useState } from 'react';
// // import { useQuery } from '@tanstack/react-query';
// // import { adminApi } from '@/lib/api/admin.api';
// // import { usePagination } from '@/hooks/use-pagination';
// // import { useDebounce } from '@/hooks/use-debounce';
// // import { PageHeader } from '@/components/shared/page-header';
// // import { LoadingSpinner } from '@/components/shared/loading-spinner';
// // import { PaginationControls } from '@/components/shared/pagination-controls';
// // import { StatusBadge } from '@/components/shared/status-badge';
// // import { Input } from '@/components/ui/input';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { formatDate, formatPhoneNumber } from '@/lib/format';
// // import { Search, Eye } from 'lucide-react';
// // import Link from 'next/link';

// // export default function AdminUsersPage() {
// //   const { page, setPage } = usePagination();
// //   const [search, setSearch] = useState('');
// //   const [userType, setUserType] = useState('');
// //   const debouncedSearch = useDebounce(search, 500);

// //   const { data, isLoading } = useQuery({
// //     queryKey: ['admin-users', page, debouncedSearch, userType],
// //     queryFn: () => adminApi.getUsers({ page, limit: 20, search: debouncedSearch || undefined, userType: userType || undefined }),
// //   });

// //   return (
// //     <div className="space-y-6">
// //       <PageHeader title="All Users" />
// //       <div className="card-premium p-5 mb-6">
// //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //           <div className="relative sm:col-span-2">
// //             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //             <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-lg" />
// //           </div>
// //           <Select value={userType} onValueChange={setUserType}>
// //             <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="All Types" /></SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="">All Types</SelectItem>
// //               <SelectItem value="MEMBER">Members</SelectItem>
// //               <SelectItem value="CLIENT">Clients</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>
// //       </div>

// //       {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : (
// //         <>
// //           <div className="space-y-3">
// //             {data?.data?.map((user: any) => (
// //               <Card key={user.id} className="card-premium">
// //                 <CardContent className="p-4 flex items-center justify-between">
// //                   <div>
// //                     <p className="font-semibold">{user.fullName}</p>
// //                     <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
// //                       <span>{formatPhoneNumber(user.phoneNumber)}</span><span>•</span>
// //                       <span>{user.userType}</span><span>•</span>
// //                       <span>Joined {formatDate(user.createdAt)}</span>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-3">
// //                     <StatusBadge status={user.verificationStatus} />
// //                     <Link href={`/admin/users/${user.id}`}><Button variant="outline" size="sm" className="rounded-lg gap-1"><Eye className="h-3.5 w-3.5" />View</Button></Link>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //           {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
// //         </>
// //       )}
// //     </div>
// //   );
// // }
// 'use client';

// import { useState } from 'react';
// import { useAdminUsers, useSuspendUser, useReactivateUser, useToggleMemberFeatured, useResetUserPassword } from '@/hooks/use-admin';
// import { usePagination } from '@/hooks/use-pagination';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { UserTable } from '@/components/admin/user-table';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { useDebounce } from '@/hooks/use-debounce';
// import { Search, Download, Users } from 'lucide-react';
// import { useExportUsers } from '@/hooks/use-admin';

// export default function AdminUsersPage() {
//   const { page, setPage } = usePagination();
//   const [search, setSearch] = useState('');
//   const [userType, setUserType] = useState('');
//   const [status, setStatus] = useState('');
//   const debouncedSearch = useDebounce(search, 500);

//   const { data, isLoading } = useAdminUsers({
//     page,
//     limit: 20,
//     search: debouncedSearch || undefined,
//     userType: userType || undefined,
//     verificationStatus: status || undefined,
//   });

//   const suspendUser = useSuspendUser();
//   const reactivateUser = useReactivateUser();
//   const featureMember = useToggleMemberFeatured();
//   const resetPassword = useResetUserPassword();
//   const exportUsers = useExportUsers();

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="User Management"
//         description="View and manage all platform users"
//         badge="Users"
//         action={
//           <Button
//             variant="outline"
//             className="rounded-xl"
//             onClick={() => exportUsers.mutate({ userType: userType || undefined })}
//             disabled={exportUsers.isPending}
//           >
//             <Download className="mr-2 h-4 w-4" />
//             Export
//           </Button>
//         }
//       />

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="relative">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search by name, phone, email..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10 rounded-xl h-11"
//           />
//         </div>
//         <Select value={userType} onValueChange={setUserType}>
//           <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="All User Types" /></SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="">All Types</SelectItem>
//             <SelectItem value="MEMBER">Members</SelectItem>
//             <SelectItem value="CLIENT">Clients</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select value={status} onValueChange={setStatus}>
//           <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="All Statuses" /></SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="">All Statuses</SelectItem>
//             <SelectItem value="PENDING">Pending</SelectItem>
//             <SelectItem value="VERIFIED">Verified</SelectItem>
//             <SelectItem value="REJECTED">Rejected</SelectItem>
//             <SelectItem value="SUSPENDED">Suspended</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-20" />
//       ) : (
//         <>
//           <UserTable
//             users={data?.data || []}
//             title={`All Users (${data?.meta?.total || 0})`}
//             onSuspend={(userId, reason) => suspendUser.mutate({ userId, reason })}
//             onReactivate={(userId) => reactivateUser.mutate(userId)}
//             onFeature={(memberId) => featureMember.mutate(memberId)}
//             onResetPassword={(userId) => resetPassword.mutate({ userId, newPassword: 'Temp@12345' })}
//           />
//           {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
//         </>
//       )}
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useAdminUsers, useSuspendUser, useReactivateUser, useToggleMemberFeatured, useResetUserPassword, useExportUsers } from '@/hooks/use-admin';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { UserTable } from '@/components/admin/user-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download } from 'lucide-react';

export default function AdminUsersPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('_all');
  const [status, setStatus] = useState('_all');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    userType: userType === '_all' ? undefined : userType,
    verificationStatus: status === '_all' ? undefined : status,
  });

  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();
  const featureMember = useToggleMemberFeatured();
  const resetPassword = useResetUserPassword();
  const exportUsers = useExportUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage all platform users"
        badge="Users"
        action={
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => exportUsers.mutate({ userType: userType === '_all' ? undefined : userType })}
            disabled={exportUsers.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>
        <Select value={userType} onValueChange={setUserType}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="All User Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="_all">All Types</SelectItem>
            <SelectItem value="MEMBER">Members</SelectItem>
            <SelectItem value="CLIENT">Clients</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="_all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <>
          <UserTable
            users={data?.data || []}
            title={`All Users (${data?.meta?.total || 0})`}
            onSuspend={(userId, reason) => suspendUser.mutate({ userId, reason })}
            onReactivate={(userId) => reactivateUser.mutate(userId)}
            onFeature={(memberId) => featureMember.mutate(memberId)}
            onResetPassword={(userId) => resetPassword.mutate({ userId, newPassword: 'Temp@12345' })}
          />
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}