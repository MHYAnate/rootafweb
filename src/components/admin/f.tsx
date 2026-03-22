'use client';

import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RotateCcw,
  Shield,
  type LucideIcon,
} from 'lucide-react';

// ✅ Config uses only primitives + component refs (never rendered as children)
interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: LucideIcon;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
    icon: AlertCircle,
  },
  RESUBMITTED: {
    label: 'Resubmitted',
    color: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
    icon: RotateCcw,
  },
  VERIFIED: {
    label: 'Verified',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    icon: CheckCircle,
  },
  APPROVED: {
    label: 'Approved',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
    icon: XCircle,
  },
  ACTIVE: {
    label: 'Active',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    icon: CheckCircle,
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'text-gray-700 dark:text-gray-400',
    bg: 'bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800',
    icon: Shield,
  },
};

interface StatusBadgeProps {
  status: string | { label?: string; icon?: any } | undefined | null;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  // ✅ SAFETY: extract string if an object was passed
  let statusKey: string;

  if (!status) {
    statusKey = 'UNKNOWN';
  } else if (typeof status === 'string') {
    statusKey = status;
  } else if (typeof status === 'object' && 'label' in status) {
    // Someone passed {label, icon} — extract the label
    statusKey = String(status.label || 'UNKNOWN');
  } else {
    statusKey = String(status);
  }

  const config = STATUS_MAP[statusKey.toUpperCase()];

  // Fallback for unknown statuses
  if (!config) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
          'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-950/30 dark:border-gray-800 dark:text-gray-400',
          className
        )}
      >
        {/* ✅ Render the string, never the object */}
        {statusKey}
      </span>
    );
  }

  // ✅ Assign icon to capitalized variable for JSX
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.bg,
        config.color,
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        className
      )}
    >
      {/* ✅ Rendered as <Icon />, not {config.icon} */}
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {/* ✅ config.label is a string */}
      {config.label}
    </span>
  );
}