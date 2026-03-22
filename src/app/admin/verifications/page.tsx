// // 'use client';

// // import { usePendingVerifications, useVerificationStats } from '@/hooks/use-admin';
// // import { usePagination } from '@/hooks/use-pagination';
// // import { PageHeader } from '@/components/shared/page-header';
// // import { LoadingSpinner } from '@/components/shared/loading-spinner';
// // import { EmptyState } from '@/components/shared/empty-state';
// // import { PaginationControls } from '@/components/shared/pagination-controls';
// // import { VerificationCard } from '@/components/admin/verification-card';
// // import { StatsCards } from '@/components/admin/stats-cards';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { CheckCircle, Clock, XCircle, RotateCcw, Users, AlertCircle } from 'lucide-react';
// // import { useState } from 'react';

// // export default function AdminVerificationsPage() {
// //   const { page, setPage } = usePagination();
// //   const [tab, setTab] = useState<string>('all');

// //   const params: any = { page, limit: 12 };
// //   if (tab !== 'all') params.status = tab;

// //   const { data, isLoading } = usePendingVerifications(params);
// //   const { data: statsData } = useVerificationStats();
// //   const stats = statsData?.data;

// //   const statCards = [
// //     { label: 'Pending', value: stats?.pending || 0, icon: Clock, gradient: 'from-gold-500 to-gold-600', alert: (stats?.pending || 0) > 0 },
// //     { label: 'Under Review', value: stats?.underReview || 0, icon: AlertCircle, gradient: 'from-royal-500 to-royal-600' },
// //     { label: 'Resubmitted', value: stats?.resubmitted || 0, icon: RotateCcw, gradient: 'from-orange-500 to-orange-600' },
// //     { label: 'Verified', value: stats?.verified || 0, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
// //     { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, gradient: 'from-red-500 to-red-600' },
// //     { label: 'Total', value: stats?.total || 0, icon: Users, gradient: 'from-primary to-emerald-600' },
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       <PageHeader
// //         title="User Verifications"
// //         description="Review and verify user registrations"
// //         badge="Verification Queue"
// //       />

// //       {/* Stats */}
// //       <StatsCards stats={statCards} />

// //       {/* Tabs */}
// //       <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1); }}>
// //         <TabsList className="rounded-xl">
// //           <TabsTrigger value="all" className="rounded-lg">All Pending</TabsTrigger>
// //           <TabsTrigger value="PENDING" className="rounded-lg">New</TabsTrigger>
// //           <TabsTrigger value="RESUBMITTED" className="rounded-lg">Resubmitted</TabsTrigger>
// //           <TabsTrigger value="UNDER_REVIEW" className="rounded-lg">Under Review</TabsTrigger>
// //         </TabsList>

// //         <TabsContent value={tab} className="mt-6">
// //           {isLoading ? (
// //             <LoadingSpinner size="lg" className="py-20" />
// //           ) : !data?.data?.length ? (
// //             <EmptyState
// //               icon={CheckCircle}
// //               title="No pending verifications"
// //               description="All users have been reviewed. Great job!"
// //             />
// //           ) : (
// //             <>
// //               <div className="space-y-4">
// //                 {data.data.map((user: any) => (
// //                   <VerificationCard key={user.length + 1} user={user} />
// //                 ))}
// //               </div>
// //               {data.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
// //             </>
// //           )}
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   );
// // }

// // app/admin/verifications/page.tsx
// 'use client';

// import { useState, useMemo } from 'react';
// import { usePendingVerifications, useVerificationStats } from '@/hooks/use-admin';
// import { usePagination } from '@/hooks/use-pagination';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { VerificationCard } from '@/components/admin/verification-card';
// import { StatsCards } from '@/components/admin/stats-cards';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   CheckCircle, Clock, XCircle, RotateCcw,
//   Users, AlertCircle, Search, Sparkles,
//   type LucideIcon,
// } from 'lucide-react';

// function toNumber(val: unknown): number {
//   if (typeof val === 'number') return val;
//   if (typeof val === 'string') return parseInt(val, 10) || 0;
//   if (val && typeof val === 'object') {
//     const obj = val as Record<string, unknown>;
//     if ('value' in obj) return Number(obj.value) || 0;
//     if ('count' in obj) return Number(obj.count) || 0;
//   }
//   return 0;
// }

// interface TabConfig {
//   value: string;
//   label: string;
//   icon: LucideIcon;
// }

// const TABS: TabConfig[] = [
//   { value: 'all', label: 'All Pending', icon: Users },
//   { value: 'PENDING', label: 'New', icon: Clock },
//   { value: 'RESUBMITTED', label: 'Resubmitted', icon: RotateCcw },
//   { value: 'UNDER_REVIEW', label: 'Under Review', icon: AlertCircle },
// ];

// export default function AdminVerificationsPage() {
//   const { page, setPage } = usePagination();
//   const [tab, setTab] = useState('all');
//   const [search, setSearch] = useState('');

//   const params = useMemo(() => {
//     const p: Record<string, string | number> = { page, limit: 12 };
//     if (tab !== 'all') p.status = tab;
//     if (search.trim()) p.search = search.trim();
//     return p;
//   }, [page, tab, search]);

//   const { data, isLoading, isFetching } = usePendingVerifications(params as any);
//   const { data: statsData } = useVerificationStats();
//   const stats = statsData?.data;

//   const statCards = [
//     { label: 'Pending', value: toNumber(stats?.pending), icon: Clock, gradient: 'from-amber-500 to-amber-600', alert: toNumber(stats?.pending) > 0 },
//     { label: 'Under Review', value: toNumber(stats?.underReview), icon: AlertCircle, gradient: 'from-blue-500 to-blue-600' },
//     { label: 'Resubmitted', value: toNumber(stats?.resubmitted), icon: RotateCcw, gradient: 'from-orange-500 to-orange-600', alert: toNumber(stats?.resubmitted) > 0 },
//     { label: 'Verified', value: toNumber(stats?.verified), icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
//     { label: 'Rejected', value: toNumber(stats?.rejected), icon: XCircle, gradient: 'from-red-500 to-red-600' },
//     { label: 'Total', value: toNumber(stats?.total), icon: Users, gradient: 'from-violet-500 to-violet-600' },
//   ];

//   return (
//     <div className="space-y-8">
//       <PageHeader
//         title="User Verifications"
//         description="Review and verify user registrations"
//         badge="Verification Queue"
//       />

//       <StatsCards stats={statCards} />

//       <Tabs
//         value={tab}
//         onValueChange={(v) => { setTab(v); setPage(1); }}
//       >
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <TabsList className="rounded-xl">
//             {TABS.map((t) => {
//               const TabIcon = t.icon;
//               return (
//                 <TabsTrigger key={t.value} value={t.value} className="rounded-lg gap-1.5">
//                   <TabIcon className="h-3.5 w-3.5" />
//                   {t.label}
//                 </TabsTrigger>
//               );
//             })}
//           </TabsList>

//           <div className="relative w-full sm:w-64">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by name or email..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//               className="pl-9 rounded-lg"
//             />
//           </div>
//         </div>

//         {isFetching && !isLoading && (
//           <div className="h-1 mt-4 rounded-full overflow-hidden bg-muted">
//             <div className="h-full w-1/3 rounded-full bg-primary animate-pulse" />
//           </div>
//         )}

//         <TabsContent value={tab} className="mt-6">
//           {isLoading ? (
//             <LoadingSpinner size="lg" className="py-20" />
//           ) : !data?.data?.length ? (
//             <Card className="border-dashed">
//               <CardContent className="flex flex-col items-center justify-center py-20">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 mb-4">
//                   <Sparkles className="h-8 w-8 text-emerald-500" />
//                 </div>
//                 <h3 className="text-lg font-semibold">All Clear!</h3>
//                 <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
//                   {search
//                     ? `No results for "${search}".`
//                     : 'No pending verifications. All users have been reviewed.'}
//                 </p>
//                 {search && (
//                   <Button variant="outline" className="mt-4" onClick={() => setSearch('')}>
//                     Clear Search
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ) : (
//             <>
//               <div className="space-y-4">
//                 {data.data.map((user: any) => (
//                   // ✅ No sanitizeUser needed — VerificationCard handles it internally
//                   <VerificationCard key={user.id} user={user} />
//                 ))}
//               </div>
//               {data.meta && (
//                 <PaginationControls meta={data.meta} onPageChange={setPage} />
//               )}
//             </>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePendingVerifications, useVerificationStats } from '@/hooks/use-admin';
import {
  IconClock, IconCheck, IconX, IconRotate,
  IconUsers, IconAlert, IconSearch, IconEye,
  IconFile, IconChevronLeft, IconChevronRight,
  IconLoader, IconSparkle,
  type IconComponent,
} from '@/components/about/icon';

/* ─── helpers ─── */

function safeStr(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object' && 'label' in (v as any)) return String((v as any).label);
  return String(v);
}

function toNum(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseInt(v, 10) || 0;
  if (v && typeof v === 'object') {
    const o = v as any;
    if ('value' in o) return Number(o.value) || 0;
    if ('count' in o) return Number(o.count) || 0;
  }
  return 0;
}

function timeAgo(d: string | undefined): string {
  if (!d) return '';
  try {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const dy = Math.floor(h / 24);
    if (dy < 30) return `${dy}d ago`;
    return `${Math.floor(dy / 30)}mo ago`;
  } catch {
    return '';
  }
}

/* ─── status config ─── */

const STATUS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:      { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Pending' },
  UNDER_REVIEW: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    label: 'Under Review' },
  RESUBMITTED:  { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  label: 'Resubmitted' },
  VERIFIED:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Verified' },
  REJECTED:     { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Rejected' },
};

const TABS = [
  { value: 'all',          label: 'All' },
  { value: 'PENDING',      label: 'Pending' },
  { value: 'RESUBMITTED',  label: 'Resubmitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
];

/* ─── stat card ─── */

interface StatDef {
  label: string;
  value: number;
  color: string;
  bgIcon: string;
  Icon: IconComponent;
}

function StatCard({ stat }: { stat: StatDef }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bgIcon}`}>
          <stat.Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {stat.label}
          </p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── page ─── */

export default function VerificationsPage() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // build params
  const params = useMemo(() => {
    const p: Record<string, string | number> = { page, limit: 10 };
    if (tab !== 'all') p.status = tab;
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim();
    return p;
  }, [page, tab, debouncedSearch]);

  // ✅ hooks from use-admin
  const { data, isLoading } = usePendingVerifications(params);
  const { data: statsData } = useVerificationStats();

  const stats = statsData?.data ?? statsData;
  const users: any[] = data?.data ?? [];
  const meta = data?.meta ?? null;

  const statCards: StatDef[] = [
    { label: 'Pending',      value: toNum(stats?.pending),     color: 'text-amber-600',   bgIcon: 'bg-amber-50',   Icon: IconClock },
    { label: 'Under Review', value: toNum(stats?.underReview), color: 'text-blue-600',    bgIcon: 'bg-blue-50',    Icon: IconAlert },
    { label: 'Resubmitted',  value: toNum(stats?.resubmitted), color: 'text-orange-600',  bgIcon: 'bg-orange-50',  Icon: IconRotate },
    { label: 'Verified',     value: toNum(stats?.verified),    color: 'text-emerald-600', bgIcon: 'bg-emerald-50', Icon: IconCheck },
    { label: 'Rejected',     value: toNum(stats?.rejected),    color: 'text-red-600',     bgIcon: 'bg-red-50',     Icon: IconX },
    { label: 'Total',        value: toNum(stats?.total),       color: 'text-gray-700',    bgIcon: 'bg-gray-100',   Icon: IconUsers },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage user verification requests
        </p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      {/* tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                tab === t.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <IconLoader className="h-8 w-8 text-gray-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
            <IconSparkle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">All clear!</p>
            <p className="text-sm text-gray-500 mt-1">
              {search ? `No results for "${search}"` : 'No pending verifications'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          users.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </div>

      {/* pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <IconChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.page >= meta.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── user row ─── */

function UserRow({ user }: { user: any }) {
  const status = safeStr(user.verificationStatus);
  const st = STATUS[status] || STATUS.PENDING;
  const name = safeStr(user.fullName);
  const email = safeStr(user.email);
  const phone = safeStr(user.phoneNumber);
  const userType = safeStr(user.userType);
  const docCount = Array.isArray(user.verificationDocuments)
    ? user.verificationDocuments.length
    : 0;
  const resubCount =
    typeof user.resubmissionCount === 'number' ? user.resubmissionCount : 0;

  let providerLabel = '';
  const pt = user.memberProfile?.providerType;
  if (pt) {
    providerLabel =
      typeof pt === 'string'
        ? pt
        : typeof pt === 'object' && pt !== null && 'label' in pt
          ? String(pt.label)
          : '';
  }

  return (
    <Link
      href={`/admin/verifications/${user.id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <span className="text-base font-bold text-blue-600">
            {name[0]?.toUpperCase() || '?'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 truncate">{name}</p>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5 flex-wrap">
            <span className="truncate">{email}</span>
            {phone && (
              <>
                <span className="text-gray-300">·</span>
                <span>{phone}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
            <span>{userType}</span>
            {providerLabel && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-blue-500 font-medium">{providerLabel}</span>
              </>
            )}
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1">
              <IconFile className="h-3 w-3" />
              {docCount} doc{docCount !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1">
              <IconClock className="h-3 w-3" />
              {timeAgo(user.verificationSubmittedAt || user.createdAt)}
            </span>
            {resubCount > 0 && (
              <span className="text-orange-500 font-medium">
                Resubmitted {resubCount}x
              </span>
            )}
          </div>
        </div>

        <IconEye className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}