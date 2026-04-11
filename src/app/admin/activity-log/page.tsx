// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { adminApi } from '@/lib/api/admin.api';
// import { usePagination } from '@/hooks/use-pagination';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { Card, CardContent } from '@/components/ui/card';
// import { formatDateTime } from '@/lib/format';
// import { Activity } from 'lucide-react';

// export default function ActivityLogPage() {
//   const { page, setPage } = usePagination(20);
//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-activity-log', page],
//     queryFn: () => adminApi.getActivityLog({ page, limit: 20 }),
//   });

//   return (
//     <div className="space-y-6">
//       <PageHeader title="Activity Log" description="Admin actions audit trail" />
//       {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : (
//         <>
//           <div className="space-y-2">
//             {data?.data?.map((log: any) => (
//               <Card key={log.id} className="card-premium">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-3">
//                     <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <Activity className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">{log.actionDescription}</p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                         <span>{log.admin?.fullName}</span><span>•</span>
//                         <span>{log.actionType?.replace(/_/g, ' ')}</span><span>•</span>
//                         <span>{formatDateTime(log.createdAt)}</span>
//                       </div>
//                       {log.targetName && <p className="text-xs text-muted-foreground mt-0.5">Target: {log.targetName}</p>}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//           {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
//         </>
//       )}
//     </div>
//   );
// // }
// 'use client';

// import { useState } from 'react';
// import { useAdminActivityLog } from '@/hooks/use-admin';
// import { usePagination } from '@/hooks/use-pagination';
// import { useDebounce } from '@/hooks/use-debounce';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { formatDateTime, formatRelativeTime } from '@/lib/format';
// import { Activity, Search, Clock, User } from 'lucide-react';

// export default function AdminActivityLogPage() {
//   const { page, setPage } = usePagination();
//   const [actionType, setActionType] = useState('all');

//   const { data, isLoading } = useAdminActivityLog({
//     page,
//     limit: 30,
//     actionType: actionType === 'all' ? undefined : actionType,
//   });

//   const getActionColor = (type: string) => {
//     if (type.includes('APPROVED') || type.includes('CREATED') || type.includes('REACTIVATED')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//     if (type.includes('REJECTED') || type.includes('SUSPENDED') || type.includes('DEACTIVATED') || type.includes('DELETED')) return 'bg-red-50 text-red-700 border-red-200';
//     if (type.includes('LOGIN') || type.includes('LOGOUT')) return 'bg-royal-50 text-royal-700 border-royal-200';
//     if (type.includes('UPDATED') || type.includes('CHANGED')) return 'bg-gold-50 text-gold-700 border-gold-200';
//     return 'bg-muted text-muted-foreground border-border';
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Admin Activity Log"
//         description="Audit trail of all admin actions"
//         badge="Audit"
//       />

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
//         <Select value={actionType} onValueChange={setActionType}>
//           <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="All Actions" /></SelectTrigger>
//           <SelectContent className="rounded-xl max-h-[300px]">
//             <SelectItem value="all">All Actions</SelectItem>
//             <SelectItem value="LOGIN">Login</SelectItem>
//             <SelectItem value="LOGOUT">Logout</SelectItem>
//             <SelectItem value="MEMBER_VERIFICATION_APPROVED">Member Approved</SelectItem>
//             <SelectItem value="MEMBER_VERIFICATION_REJECTED">Member Rejected</SelectItem>
//             <SelectItem value="CLIENT_VERIFICATION_APPROVED">Client Approved</SelectItem>
//             <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
//             <SelectItem value="USER_REACTIVATED">User Reactivated</SelectItem>
//             <SelectItem value="USER_PASSWORD_RESET">Password Reset</SelectItem>
//             <SelectItem value="ADMIN_CREATED">Admin Created</SelectItem>
//             <SelectItem value="SETTINGS_CHANGED">Settings Changed</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-20" />
//       ) : !data?.data?.length ? (
//         <EmptyState icon={Activity} title="No activity logged" />
//       ) : (
//         <>
//           <div className="space-y-2">
//             {data.data.map((log: any) => (
//               <Card key={log.id} className="rounded-xl border-border/50 hover:bg-muted/20 transition-colors">
//                 <CardContent className="p-4">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{log.actionDescription}</p>
//                       <div className="flex items-center gap-3 mt-1.5">
//                         <Badge className={`text-[10px] border ${getActionColor(log.actionType)}`}>
//                           {log.actionType.replace(/_/g, ' ')}
//                         </Badge>
//                         {log.targetName && (
//                           <span className="text-xs text-muted-foreground">
//                             Target: <span className="font-medium text-foreground">{log.targetName}</span>
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="text-xs font-medium flex items-center gap-1">
//                         <User className="h-3 w-3" />
//                         {log.admin?.fullName}
//                       </p>
//                       <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
//                         <Clock className="h-3 w-3" />
//                         {formatRelativeTime(log.createdAt)}
//                       </p>
//                       {log.ipAddress && (
//                         <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{log.ipAddress}</p>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//           {data.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
//         </>
//       )}
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useAdminActivityLog } from '@/hooks/use-admin';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, formatRelativeTime } from '@/lib/format';
import { Activity, Search, Clock, User } from 'lucide-react';

export default function AdminActivityLogPage() {
  const { page, setPage } = usePagination();
  const [actionType, setActionType] = useState<string>('all');

  const { data, isLoading } = useAdminActivityLog({
    page,
    limit: 30,
    actionType: actionType === 'all' ? undefined : actionType,
  });

  const getActionColor = (type: string) => {
    if (type.includes('APPROVED') || type.includes('CREATED') || type.includes('REACTIVATED')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (type.includes('REJECTED') || type.includes('SUSPENDED') || type.includes('DEACTIVATED') || type.includes('DELETED')) return 'bg-red-50 text-red-700 border-red-200';
    if (type.includes('LOGIN') || type.includes('LOGOUT')) return 'bg-royal-50 text-royal-700 border-royal-200';
    if (type.includes('UPDATED') || type.includes('CHANGED')) return 'bg-gold-50 text-gold-700 border-gold-200';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Activity Log"
        description="Audit trail of all admin actions"
        badge="Audit"
      />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <Select value={actionType} onValueChange={setActionType}>
          <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="All Actions" /></SelectTrigger>
          <SelectContent className="rounded-xl max-h-[300px]">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
            <SelectItem value="MEMBER_VERIFICATION_APPROVED">Member Approved</SelectItem>
            <SelectItem value="MEMBER_VERIFICATION_REJECTED">Member Rejected</SelectItem>
            <SelectItem value="CLIENT_VERIFICATION_APPROVED">Client Approved</SelectItem>
            <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
            <SelectItem value="USER_REACTIVATED">User Reactivated</SelectItem>
            <SelectItem value="USER_PASSWORD_RESET">Password Reset</SelectItem>
            <SelectItem value="ADMIN_CREATED">Admin Created</SelectItem>
            <SelectItem value="SETTINGS_CHANGED">Settings Changed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : !data?.data?.length ? (
        <EmptyState icon={Activity} title="No activity logged" />
      ) : (
        <>
          <div className="space-y-2">
            {data.data.map((log: any) => (
              <Card key={log.id} className="rounded-xl border-border/50 hover:bg-muted/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.actionDescription}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge className={`text-[10px] border ${getActionColor(log.actionType)}`}>
                          {log.actionType.replace(/_/g, ' ')}
                        </Badge>
                        {log.targetName && (
                          <span className="text-xs text-muted-foreground">
                            Target: <span className="font-medium text-foreground">{log.targetName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.admin?.fullName}
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(log.createdAt)}
                      </p>
                      {log.ipAddress && (
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{log.ipAddress}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}