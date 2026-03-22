'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  useAdminUsers,
  useVerificationStats,
} from '@/hooks/use-admin';
import {
  IconClock, IconCheck, IconX, IconRotate,
  IconUsers, IconAlert, IconSearch, IconEye,
  IconFile, IconChevronLeft, IconChevronRight,
  IconLoader, IconSparkle,
  type IconComponent,
} from '@/components/about/icon';

/* ───────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────── */

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
    if ('_count' in o) return Number(o._count) || 0;
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

function getStatusCount(
  arr: Array<{ _count: number; verificationStatus: string }> | undefined,
  status: string
): number {
  if (!Array.isArray(arr)) return 0;
  const found = arr.find((s) => s.verificationStatus === status);
  return found ? toNum(found._count) : 0;
}

function getTotalCount(
  arr: Array<{ _count: number; verificationStatus: string }> | undefined
): number {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((sum, s) => sum + toNum(s._count), 0);
}

function getTypeSummary(
  typeCounts: Array<{ _count: number; userType: string; verificationStatus: string }> | undefined
) {
  if (!Array.isArray(typeCounts)) return [];
  const grouped: Record<string, { total: number; statuses: Record<string, number> }> = {};
  typeCounts.forEach((entry) => {
    const type = safeStr(entry.userType);
    const status = safeStr(entry.verificationStatus);
    const count = toNum(entry._count);
    if (!grouped[type]) grouped[type] = { total: 0, statuses: {} };
    grouped[type].total += count;
    grouped[type].statuses[status] = (grouped[type].statuses[status] || 0) + count;
  });
  return Object.entries(grouped).map(([type, data]) => ({
    type,
    count: data.total,
    statuses: Object.entries(data.statuses).map(([status, count]) => ({ status, count })),
  }));
}

/* ───────────────────────────────────────────
   Status config (only string values)
   ─────────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:      { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Pending' },
  UNDER_REVIEW: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    label: 'Under Review' },
  RESUBMITTED:  { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  label: 'Resubmitted' },
  VERIFIED:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Verified' },
  REJECTED:     { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Rejected' },
};

/* ───────────────────────────────────────────
   Filter tabs & user type options
   ─────────────────────────────────────────── */

const STATUS_TABS = [
  { value: '_all',         label: 'All' },
  { value: 'PENDING',      label: 'Pending' },
  { value: 'RESUBMITTED',  label: 'Resubmitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'VERIFIED',     label: 'Verified' },
  { value: 'REJECTED',     label: 'Rejected' },
];

const USER_TYPE_OPTIONS = [
  { value: '_all',   label: 'All Types' },
  { value: 'MEMBER', label: 'Members' },
  { value: 'CLIENT', label: 'Clients' },
];

/* ───────────────────────────────────────────
   Stat card
   ─────────────────────────────────────────── */

interface StatDef {
  label: string;
  value: number;
  color: string;
  bgIcon: string;
  Icon: IconComponent;
  highlight?: boolean;
  suffix?: string;
}

function StatCard({ stat }: { stat: StatDef }) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm ${
        stat.highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bgIcon}`}>
          <stat.Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {stat.label}
          </p>
          <p className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
            {stat.suffix && (
              <span className="text-sm font-medium text-gray-400 ml-0.5">{stat.suffix}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function IconTimer({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <line x1="12" y1="1" x2="12" y2="3" />
    </svg>
  );
}

function IconKey({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   PAGINATION CONSTANTS
   ─────────────────────────────────────────── */

const PAGE_SIZE = 10;

/* ───────────────────────────────────────────
   Page Component
   ─────────────────────────────────────────── */

export default function VerificationsPage() {
  const [status, setStatus] = useState('_all');
  const [userType, setUserType] = useState('_all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on search change
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ Fetch ALL users from API with filter params
  const { data: rawData, isLoading } = useAdminUsers({
    page: 1,
    limit: 999, // fetch all — we paginate client-side
    search: debouncedSearch || undefined,
    userType: userType === '_all' ? undefined : userType,
    verificationStatus: status === '_all' ? undefined : status,
  });

  const { data: statsData } = useVerificationStats();

  // ✅ Extract the user array from the response
  // API returns { data: [...users] } — no meta/pagination
  const allUsersRaw: any[] = useMemo(() => {
    if (!rawData) return [];
    // handle { data: [...] } or direct array
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray(rawData.data)) return rawData.data;
    return [];
  }, [rawData]);

  // ✅ CLIENT-SIDE FILTERING as fallback
  // (in case the API ignores filter params and returns everything)
  const filteredUsers = useMemo(() => {
    let result = [...allUsersRaw];

    // filter by verification status
    if (status !== '_all') {
      result = result.filter(
        (u) => safeStr(u.verificationStatus) === status
      );
    }

    // filter by user type
    if (userType !== '_all') {
      result = result.filter(
        (u) => safeStr(u.userType) === userType
      );
    }

    // filter by search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((u) => {
        const name = safeStr(u.fullName).toLowerCase();
        const email = safeStr(u.email).toLowerCase();
        const phone = safeStr(u.phoneNumber).toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
    }

    return result;
  }, [allUsersRaw, status, userType, debouncedSearch]);

  // ✅ CLIENT-SIDE PAGINATION
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, safePage]);

  // Reset page when filters change
  const handleStatusChange = useCallback((val: string) => {
    setStatus(val);
    setPage(1);
  }, []);

  const handleUserTypeChange = useCallback((val: string) => {
    setUserType(val);
    setPage(1);
  }, []);

  // ── Parse stats ──
  const statsRoot = statsData?.data ?? statsData;
  const statusCounts = statsRoot?.statusCounts;
  const typeCounts = statsRoot?.typeCounts;
  const pendingCount = toNum(statsRoot?.pendingCount);
  const pendingResets = toNum(statsRoot?.pendingResets);
  const avgHours = toNum(statsRoot?.avgVerificationHours);

  const verifiedCount = getStatusCount(statusCounts, 'VERIFIED');
  const rejectedCount = getStatusCount(statusCounts, 'REJECTED');
  const underReviewCount = getStatusCount(statusCounts, 'UNDER_REVIEW');
  const resubmittedCount = getStatusCount(statusCounts, 'RESUBMITTED');
  const pendingStatusCount = getStatusCount(statusCounts, 'PENDING');
  const totalCount = getTotalCount(statusCounts);
  const effectivePending = pendingCount || pendingStatusCount;

  const typeSummary = getTypeSummary(typeCounts);

  // ── Stat cards ──
  const statCards: StatDef[] = [
    { label: 'Pending',      value: effectivePending, color: 'text-amber-600',   bgIcon: 'bg-amber-50',   Icon: IconClock,  highlight: effectivePending > 0 },
    { label: 'Under Review', value: underReviewCount,  color: 'text-blue-600',    bgIcon: 'bg-blue-50',    Icon: IconAlert },
    { label: 'Resubmitted',  value: resubmittedCount,  color: 'text-orange-600',  bgIcon: 'bg-orange-50',  Icon: IconRotate, highlight: resubmittedCount > 0 },
    { label: 'Verified',     value: verifiedCount,     color: 'text-emerald-600', bgIcon: 'bg-emerald-50', Icon: IconCheck },
    { label: 'Rejected',     value: rejectedCount,     color: 'text-red-600',     bgIcon: 'bg-red-50',     Icon: IconX },
    { label: 'Total',        value: totalCount,        color: 'text-gray-700',    bgIcon: 'bg-gray-100',   Icon: IconUsers },
  ];

  const secondaryStats: StatDef[] = [
    { label: 'Avg Review Time', value: avgHours,      color: 'text-violet-600', bgIcon: 'bg-violet-50', Icon: IconTimer, suffix: 'hrs' },
    { label: 'Pending Resets',  value: pendingResets,  color: 'text-rose-600',   bgIcon: 'bg-rose-50',   Icon: IconKey,   highlight: pendingResets > 0 },
  ];

  // Tab counts from filtered data (counts what's actually in the fetched data)
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { _all: allUsersRaw.length };
    allUsersRaw.forEach((u) => {
      const s = safeStr(u.verificationStatus);
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [allUsersRaw]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage user verification requests
        </p>
      </div>

      {/* ── main stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      {/* ── secondary stats + type breakdown ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryStats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
        {typeSummary.map((entry) => (
          <div key={entry.type} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-indigo-50">
                <IconUsers className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  {entry.type}
                </p>
                <p className="text-2xl font-bold text-indigo-600">{entry.count}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {entry.statuses.map((s) => {
                const cfg = STATUS_CONFIG[s.status];
                return (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg?.dot || 'bg-gray-400'}`} />
                      <span className="text-gray-500">{cfg?.label || s.status}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── filters row ── */}
      <div className="space-y-3">

        {/* status tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {STATUS_TABS.map((t) => {
              const count = tabCounts[t.value] || 0;
              const isActive = status === t.value;

              return (
                <button
                  key={t.value}
                  onClick={() => handleStatusChange(t.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                  {count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* user type filter + result count */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* user type pills */}
            <div className="flex gap-1">
              {USER_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleUserTypeChange(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                    userType === opt.value
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* active filters indicator */}
            {(status !== '_all' || userType !== '_all' || debouncedSearch) && (
              <button
                onClick={() => {
                  setStatus('_all');
                  setUserType('_all');
                  setSearch('');
                  setPage(1);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <IconX className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>

          {/* result count */}
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-gray-600">{totalFiltered}</span>
            {' '}result{totalFiltered !== 1 ? 's' : ''}
            {(status !== '_all' || userType !== '_all' || debouncedSearch) && (
              <span className="text-gray-300"> (filtered)</span>
            )}
          </p>
        </div>
      </div>

      {/* ── list ── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <IconLoader className="h-8 w-8 text-gray-400" />
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
            <IconSparkle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">
              {allUsersRaw.length === 0 ? 'No users found' : 'No matching results'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : status !== '_all'
                  ? `No ${STATUS_CONFIG[status]?.label || status} verifications found`
                  : 'Try adjusting your filters'}
            </p>
            {(status !== '_all' || userType !== '_all' || debouncedSearch) && (
              <button
                onClick={() => {
                  setStatus('_all');
                  setUserType('_all');
                  setSearch('');
                  setPage(1);
                }}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          paginatedUsers.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </div>

      {/* ── pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-semibold text-gray-700">
              {(safePage - 1) * PAGE_SIZE + 1}
            </span>
            –
            <span className="font-semibold text-gray-700">
              {Math.min(safePage * PAGE_SIZE, totalFiltered)}
            </span>
            {' '}of{' '}
            <span className="font-semibold text-gray-700">{totalFiltered}</span>
          </p>

          <div className="flex items-center gap-1">
            {/* first page */}
            <button
              onClick={() => setPage(1)}
              disabled={safePage <= 1}
              className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <IconChevronLeft className="h-4 w-4" />
              <IconChevronLeft className="h-4 w-4 -ml-2.5" />
            </button>

            {/* prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <IconChevronLeft className="h-4 w-4" />
              Prev
            </button>

            {/* page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // show first, last, and pages around current
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - safePage) <= 1) return true;
                  return false;
                })
                .reduce<(number | 'dots')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) {
                    acc.push('dots');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === 'dots' ? (
                    <span key={`dots-${i}`} className="px-1 text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`h-8 min-w-8 px-2 text-sm font-medium rounded-lg transition-all ${
                        safePage === item
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            {/* next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <IconChevronRight className="h-4 w-4" />
            </button>

            {/* last page */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={safePage >= totalPages}
              className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <IconChevronRight className="h-4 w-4" />
              <IconChevronRight className="h-4 w-4 -ml-2.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   User Row
   ─────────────────────────────────────────── */

function UserRow({ user }: { user: any }) {
  const status = safeStr(user.verificationStatus);
  const st = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const name = safeStr(user.fullName);
  const email = safeStr(user.email);
  const phone = safeStr(user.phoneNumber);
  const uType = safeStr(user.userType);
  const isActive = user.isActive !== false;
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
        {/* avatar */}
        <div className="relative h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <span className="text-base font-bold text-blue-600">
            {name[0]?.toUpperCase() || '?'}
          </span>
          {/* active indicator */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
              isActive ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          />
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 truncate">{name}</p>

            {/* status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>

            {/* user type badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide">
              {uType}
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
            {providerLabel && (
              <>
                <span className="text-blue-500 font-medium">{providerLabel}</span>
                <span className="text-gray-300">·</span>
              </>
            )}
            {docCount > 0 && (
              <>
                <span className="flex items-center gap-1">
                  <IconFile className="h-3 w-3" />
                  {docCount} doc{docCount !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-300">·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <IconClock className="h-3 w-3" />
              {timeAgo(user.createdAt)}
            </span>
            {user.lastLoginAt && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-green-500">
                  Last login {timeAgo(user.lastLoginAt)}
                </span>
              </>
            )}
            {resubCount > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-orange-500 font-medium">
                  Resubmitted {resubCount}x
                </span>
              </>
            )}
          </div>
        </div>

        {/* arrow */}
        <IconEye className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}