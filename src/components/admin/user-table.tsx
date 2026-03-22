'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';

/* ───────────────────────────────────────────
   Local SVG Icons
   ─────────────────────────────────────────── */

function IconSearch({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconEye({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconStar({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconShield({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconBan({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

function IconRotate({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function IconDots({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function IconKey({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

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

function fmtDate(d: string | undefined): string {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return d;
  }
}

function fmtPhone(phone: string | undefined): string {
  if (!phone) return '—';
  const p = phone.replace(/\D/g, '');
  if (p.length === 11) return `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;
  if (p.length === 10) return `${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6)}`;
  return phone;
}

// ✅ Safely get provider type label — handles {label, icon} objects
function getProviderLabel(providerType: unknown): string {
  if (!providerType) return '';
  if (typeof providerType === 'string') return providerType;
  if (typeof providerType === 'object' && providerType !== null && 'label' in providerType) {
    return String((providerType as any).label);
  }
  return '';
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:      { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Pending' },
  UNDER_REVIEW: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    label: 'Under Review' },
  RESUBMITTED:  { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  label: 'Resubmitted' },
  VERIFIED:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Verified' },
  APPROVED:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
  REJECTED:     { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Rejected' },
  SUSPENDED:    { bg: 'bg-gray-100',   text: 'text-gray-700',    dot: 'bg-gray-500',    label: 'Suspended' },
};

/* ───────────────────────────────────────────
   Dropdown Menu (custom, no external lib)
   ─────────────────────────────────────────── */

interface DropdownItem {
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  onClick?: () => void;
  href?: string;
  color?: string;       // tailwind text color
  separator?: boolean;  // show separator before this item
  hidden?: boolean;     // conditionally hide
}

function ActionDropdown({
  items,
  userId,
}: {
  items: DropdownItem[];
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="More actions"
      >
        <IconDots className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-gray-200 bg-white shadow-lg py-1 animate-in fade-in slide-in-from-top-1">
          {visibleItems.map((item, i) => {
            const Icon = item.icon;
            const colorClass = item.color || 'text-gray-700';

            return (
              <div key={`${item.label}-${i}`}>
                {/* separator */}
                {item.separator && i > 0 && (
                  <div className="my-1 border-t border-gray-100" />
                )}

                {/* link item */}
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${colorClass}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                ) : (
                  /* button item */
                  <button
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors text-left ${colorClass}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   Suspend Modal
   ─────────────────────────────────────────── */

function SuspendModal({
  userName,
  onConfirm,
  onCancel,
}: {
  userName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!reason.trim()) {
      setError('Please provide a reason for suspension.');
      return;
    }
    onConfirm(reason.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
            <IconBan className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Suspend User</h3>
            <p className="text-sm text-gray-500">
              Suspend <span className="font-medium text-gray-700">{userName}</span>
            </p>
          </div>
        </div>

        <textarea
          value={reason}
          onChange={(e) => { setReason(e.target.value); setError(''); }}
          placeholder="Reason for suspension (required)..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />

        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm Suspension
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Confirm Modal (generic)
   ─────────────────────────────────────────── */

function ConfirmModal({
  title,
  description,
  confirmLabel,
  confirmColor,
  icon: Icon,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor: string;
  icon: (props: { className?: string }) => ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${confirmColor}`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   UserTable Component
   ─────────────────────────────────────────── */

interface UserTableProps {
  users: any[];
  title?: string;
  showActions?: boolean;
  onSuspend?: (userId: string, reason: string) => void;
  onReactivate?: (userId: string) => void;
  onFeature?: (memberId: string) => void;
  onResetPassword?: (userId: string) => void;
}

export function UserTable({
  users,
  title = 'Users',
  showActions = true,
  onSuspend,
  onReactivate,
  onFeature,
  onResetPassword,
}: UserTableProps) {
  const [search, setSearch] = useState('');

  // modal state
  const [suspendTarget, setSuspendTarget] = useState<{ id: string; name: string } | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<{ id: string; name: string } | null>(null);
  const [resetTarget, setResetTarget] = useState<{ id: string; name: string } | null>(null);
  const [featureTarget, setFeatureTarget] = useState<{ id: string; name: string } | null>(null);

  // ✅ Client-side search filter
  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const name = safeStr(u.fullName).toLowerCase();
    const phone = safeStr(u.phoneNumber).toLowerCase();
    const email = safeStr(u.email).toLowerCase();
    return name.includes(q) || phone.includes(q) || email.includes(q);
  });

  // ✅ Build action items for each user
  function getActions(user: any): DropdownItem[] {
    const status = safeStr(user.verificationStatus);
    const name = safeStr(user.fullName);
    const isSuspended = status === 'SUSPENDED' || user.isActive === false;
    const isMember = safeStr(user.userType) === 'MEMBER';
    const memberId = user.memberProfile?.id;

    const items: DropdownItem[] = [
      {
        label: 'View Details',
        icon: IconEye,
        href: `/admin/users/${user.id}`,
      },
    ];

    // Feature toggle — only for members with a profile
    if (isMember && memberId && onFeature) {
      items.push({
        label: user.memberProfile?.isFeatured ? 'Remove Featured' : 'Set Featured',
        icon: IconStar,
        color: user.memberProfile?.isFeatured ? 'text-amber-600' : 'text-gray-700',
        onClick: () => setFeatureTarget({ id: memberId, name }),
      });
    }

    // Reset password
    if (onResetPassword) {
      items.push({
        label: 'Reset Password',
        icon: IconKey,
        onClick: () => setResetTarget({ id: user.id, name }),
      });
    }

    // Suspend or reactivate
    if (isSuspended && onReactivate) {
      items.push({
        label: 'Reactivate User',
        icon: IconRotate,
        color: 'text-emerald-600',
        separator: true,
        onClick: () => setReactivateTarget({ id: user.id, name }),
      });
    } else if (!isSuspended && onSuspend) {
      items.push({
        label: 'Suspend User',
        icon: IconBan,
        color: 'text-red-600',
        separator: true,
        onClick: () => setSuspendTarget({ id: user.id, name }),
      });
    }

    return items;
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                  User
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                  Type
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                  Joined
                </th>
                {showActions && (
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => {
                const name = safeStr(user.fullName);
                const email = safeStr(user.email);
                const phone = safeStr(user.phoneNumber);
                const uType = safeStr(user.userType);
                const status = safeStr(user.verificationStatus);
                const st = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
                const isActive = user.isActive !== false;

                // ✅ Safe provider label extraction
                const providerLabel = getProviderLabel(
                  user.memberProfile?.providerType
                );

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* User cell */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-600">
                            {name[0]?.toUpperCase() || '?'}
                          </span>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                              isActive ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="truncate">{email}</span>
                            {phone && (
                              <>
                                <span className="text-gray-200">·</span>
                                <span>{fmtPhone(phone)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type cell */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide">
                          {uType}
                        </span>
                        {/* ✅ FIX: render the string label, not the raw object */}
                        {providerLabel && (
                          <p className="text-xs text-blue-500 font-medium mt-0.5">
                            {providerLabel}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status cell */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {/* ✅ st.label is always a string */}
                        {st.label}
                      </span>
                    </td>

                    {/* Joined cell */}
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-500">
                        {fmtDate(user.createdAt)}
                      </span>
                      {user.lastLoginAt && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Last login: {fmtDate(user.lastLoginAt)}
                        </p>
                      )}
                    </td>

                    {/* Actions cell */}
                    {showActions && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick view button */}
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View details"
                          >
                            <IconEye className="h-4 w-4" />
                          </Link>

                          {/* ✅ Dropdown with all actions */}
                          <ActionDropdown
                            userId={user.id}
                            items={getActions(user)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {/* Empty state */}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={showActions ? 5 : 4}
                    className="py-16 text-center"
                  >
                    <IconSearch className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      {search ? `No results for "${search}"` : 'No users found'}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer with count ── */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>

      {/* ── Modals ── */}

      {/* Suspend modal */}
      {suspendTarget && (
        <SuspendModal
          userName={suspendTarget.name}
          onConfirm={(reason) => {
            onSuspend?.(suspendTarget.id, reason);
            setSuspendTarget(null);
          }}
          onCancel={() => setSuspendTarget(null)}
        />
      )}

      {/* Reactivate confirm */}
      {reactivateTarget && (
        <ConfirmModal
          title="Reactivate User"
          description={`Reactivate ${reactivateTarget.name}? They will regain access.`}
          confirmLabel="Reactivate"
          confirmColor="bg-emerald-600 hover:bg-emerald-700"
          icon={IconRotate}
          onConfirm={() => {
            onReactivate?.(reactivateTarget.id);
            setReactivateTarget(null);
          }}
          onCancel={() => setReactivateTarget(null)}
        />
      )}

      {/* Reset password confirm */}
      {resetTarget && (
        <ConfirmModal
          title="Reset Password"
          description={`Send a password reset to ${resetTarget.name}?`}
          confirmLabel="Send Reset"
          confirmColor="bg-blue-600 hover:bg-blue-700"
          icon={IconKey}
          onConfirm={() => {
            onResetPassword?.(resetTarget.id);
            setResetTarget(null);
          }}
          onCancel={() => setResetTarget(null)}
        />
      )}

      {/* Toggle featured confirm */}
      {featureTarget && (
        <ConfirmModal
          title="Toggle Featured"
          description={`Toggle featured status for ${featureTarget.name}?`}
          confirmLabel="Confirm"
          confirmColor="bg-amber-600 hover:bg-amber-700"
          icon={IconStar}
          onConfirm={() => {
            onFeature?.(featureTarget.id);
            setFeatureTarget(null);
          }}
          onCancel={() => setFeatureTarget(null)}
        />
      )}
    </>
  );
}