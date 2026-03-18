// app/admin/content/sponsors/page.tsx

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { sponsorsApi } from '@/lib/api/sponsors.api';
import {
  useAdminCreateSponsor,
  useAdminUpdateSponsor,
  useAdminDeleteSponsor,
} from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ImageUpload } from '@/components/shared/image-upload';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { SPONSOR_CATEGORY_MAP, SPONSOR_TYPE_MAP } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Heart,
  Globe,
  Eye,
  Mail,
  Phone,
  User,
  Calendar,
  CalendarClock,
  DollarSign,
  Star,
  BookOpen,
  Building2,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  FileText,
  Users,
  Briefcase,
  Award,
  ExternalLink,
  Copy,
  LayoutGrid,
  List,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Handshake,
  TrendingUp,
  Shield,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface Sponsor {
  id: string;
  organizationName: string;
  logoUrl: string | null;
  logoThumbnailUrl: string | null;
  type: string;
  category: string;
  description: string | null;
  shortDescription: string | null;
  website: string | null;
  contactPersonName: string | null;
  contactPersonTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  partnershipSince: string | null;
  partnershipEndDate: string | null;
  isOngoing: boolean;
  sponsorshipLevel: string | null;
  sponsorshipAmount: number | null;
  areasOfSupport: string[];
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  showOnAboutPage: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SponsorFormData {
  organizationName: string;
  type: string;
  category: string;
  description: string;
  shortDescription: string;
  logoUrl: string;
  website: string;
  contactPersonName: string;
  contactPersonTitle: string;
  contactEmail: string;
  contactPhone: string;
  partnershipSince: string;
  partnershipEndDate: string;
  isOngoing: boolean;
  sponsorshipLevel: string;
  sponsorshipAmount: string;
  areasOfSupport: string[];
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  showOnAboutPage: boolean;
}

const defaultForm: SponsorFormData = {
  organizationName: '',
  type: 'SPONSOR',
  category: 'CORPORATE_PRIVATE_SECTOR',
  description: '',
  shortDescription: '',
  logoUrl: '',
  website: '',
  contactPersonName: '',
  contactPersonTitle: '',
  contactEmail: '',
  contactPhone: '',
  partnershipSince: '',
  partnershipEndDate: '',
  isOngoing: true,
  sponsorshipLevel: '',
  sponsorshipAmount: '',
  areasOfSupport: [],
  displayOrder: 0,
  isActive: true,
  isFeatured: false,
  showOnAboutPage: true,
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const sponsorshipLevelColors: Record<string, string> = {
  Platinum:
    'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300 dark:from-slate-800 dark:to-slate-700 dark:text-slate-200 dark:border-slate-600',
  Gold: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 dark:from-amber-950/40 dark:to-yellow-950/40 dark:text-amber-300 dark:border-amber-800',
  Silver:
    'bg-gradient-to-r from-gray-50 to-zinc-100 text-gray-600 border-gray-300 dark:from-gray-800 dark:to-zinc-800 dark:text-gray-300 dark:border-gray-600',
  Bronze:
    'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 dark:from-orange-950/40 dark:to-amber-950/40 dark:text-orange-300 dark:border-orange-800',
};

const typeColors: Record<string, string> = {
  SPONSOR: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  PARTNER: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  DONOR: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  COLLABORATOR: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
};

const typeIcons: Record<string, typeof Heart> = {
  SPONSOR: DollarSign,
  PARTNER: Handshake,
  DONOR: Heart,
  COLLABORATOR: Users,
};

function formatDate(date: string | null): string {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

function formatDateRelative(date: string | null): string {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

function formatCurrency(amount: number | null): string {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function toDateInputValue(date: string | null): string {
  if (!date) return '';
  try {
    return format(new Date(date), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

// ═══════════════════════════════════════════════════════════
// DETAIL ROW COMPONENT
// ═══════════════════════════════════════════════════════════

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
  copyable,
  badge,
  badgeVariant,
}: {
  icon: typeof Heart;
  label: string;
  value: string | number | null | undefined;
  href?: string;
  copyable?: boolean;
  badge?: boolean;
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
}) {
  const displayValue = value === null || value === undefined || value === '' ? '—' : String(value);
  const isEmpty = displayValue === '—';

  const handleCopy = () => {
    if (displayValue !== '—') {
      navigator.clipboard.writeText(displayValue);
    }
  };

  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {badge ? (
            <Badge variant={badgeVariant || 'outline'} className="text-xs">
              {displayValue}
            </Badge>
          ) : href && !isEmpty ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline underline-offset-4 flex items-center gap-1"
            >
              {displayValue}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <p
              className={cn(
                'text-sm',
                isEmpty
                  ? 'text-muted-foreground/40 italic'
                  : 'text-foreground',
              )}
            >
              {displayValue}
            </p>
          )}
          {copyable && !isEmpty && (
            <button
              onClick={handleCopy}
              className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
              title="Copy"
            >
              <Copy className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DETAIL SHEET COMPONENT
// ═══════════════════════════════════════════════════════════

function SponsorDetailSheet({
  sponsor,
  open,
  onClose,
  onEdit,
}: {
  sponsor: Sponsor | null;
  open: boolean;
  onClose: () => void;
  onEdit: (sponsor: Sponsor) => void;
}) {
  if (!sponsor) return null;

  const TypeIcon = typeIcons[sponsor.type] || Heart;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border/50">
          <div
            className="h-1.5"
            style={{ background: 'var(--gradient-premium)' }}
          />
          <SheetHeader className="p-5 pb-4">
            <div className="flex items-start gap-4">
              {sponsor.logoUrl ? (
                <img
                  src={sponsor.logoUrl}
                  alt={sponsor.organizationName}
                  className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 flex items-center justify-center ring-1 ring-amber-200/50 dark:ring-amber-800/50 shadow-md">
                  <TypeIcon className="h-7 w-7 text-amber-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg font-bold leading-tight">
                  {sponsor.organizationName}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Details for {sponsor.organizationName}
                </SheetDescription>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge
                    className={cn(
                      'text-[10px] border',
                      typeColors[sponsor.type],
                    )}
                  >
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {SPONSOR_TYPE_MAP[sponsor.type] || sponsor.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {SPONSOR_CATEGORY_MAP[sponsor.category] ||
                      sponsor.category}
                  </Badge>
                  {sponsor.sponsorshipLevel && (
                    <Badge
                      className={cn(
                        'text-[10px] border',
                        sponsorshipLevelColors[sponsor.sponsorshipLevel] ||
                          '',
                      )}
                    >
                      <Award className="h-3 w-3 mr-1" />
                      {sponsor.sponsorshipLevel}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex flex-wrap gap-2 mt-3">
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
                  sponsor.isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                )}
              >
                {sponsor.isActive ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {sponsor.isActive ? 'Active' : 'Inactive'}
              </div>
              {sponsor.isFeatured && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  <Star className="h-3 w-3" />
                  Featured
                </div>
              )}
              {sponsor.showOnAboutPage && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  <BookOpen className="h-3 w-3" />
                  About Page
                </div>
              )}
              {sponsor.isOngoing && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/5 text-primary">
                  <TrendingUp className="h-3 w-3" />
                  Ongoing
                </div>
              )}
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          {/* Description Section */}
          {(sponsor.description || sponsor.shortDescription) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                Description
              </h4>
              <div className="rounded-xl bg-muted/30 border border-border/50 p-4 space-y-3">
                {sponsor.shortDescription && (
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Short Description
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {sponsor.shortDescription}
                    </p>
                  </div>
                )}
                {sponsor.description && (
                  <div>
                    {sponsor.shortDescription && (
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Full Description
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {sponsor.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organization Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3 flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" />
              Organization Details
            </h4>
            <div className="rounded-xl bg-muted/30 border border-border/50 p-4 divide-y divide-border/50">
              <DetailRow
                icon={Building2}
                label="Organization"
                value={sponsor.organizationName}
              />
              <DetailRow
                icon={typeIcons[sponsor.type] || Heart}
                label="Type"
                value={SPONSOR_TYPE_MAP[sponsor.type] || sponsor.type}
                badge
              />
              <DetailRow
                icon={Briefcase}
                label="Category"
                value={
                  SPONSOR_CATEGORY_MAP[sponsor.category] ||
                  sponsor.category
                }
                badge
                badgeVariant="secondary"
              />
              <DetailRow
                icon={Globe}
                label="Website"
                value={sponsor.website}
                href={sponsor.website || undefined}
              />
              <DetailRow
                icon={ArrowUpDown}
                label="Display Order"
                value={sponsor.displayOrder}
              />
            </div>
          </div>

          {/* Partnership & Sponsorship */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3 flex items-center gap-2">
              <Handshake className="h-3.5 w-3.5" />
              Partnership & Sponsorship
            </h4>
            <div className="rounded-xl bg-muted/30 border border-border/50 p-4 divide-y divide-border/50">
              <DetailRow
                icon={Calendar}
                label="Partnership Since"
                value={formatDate(sponsor.partnershipSince)}
              />
              <DetailRow
                icon={CalendarClock}
                label="Partnership End Date"
                value={
                  sponsor.isOngoing
                    ? 'Ongoing'
                    : formatDate(sponsor.partnershipEndDate)
                }
              />
              {sponsor.partnershipSince && (
                <DetailRow
                  icon={Clock}
                  label="Partnership Duration"
                  value={formatDateRelative(sponsor.partnershipSince)}
                />
              )}
              <DetailRow
                icon={Award}
                label="Sponsorship Level"
                value={sponsor.sponsorshipLevel}
                badge
              />
              <DetailRow
                icon={DollarSign}
                label="Sponsorship Amount"
                value={formatCurrency(sponsor.sponsorshipAmount)}
              />
            </div>
          </div>

          {/* Areas of Support */}
          {sponsor.areasOfSupport && sponsor.areasOfSupport.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Areas of Support
              </h4>
              <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
                <div className="flex flex-wrap gap-2">
                  {sponsor.areasOfSupport.map((area, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs py-1 px-3 rounded-full bg-primary/5 border-primary/15 text-primary"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3 flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              Contact Information
            </h4>
            <div className="rounded-xl bg-muted/30 border border-border/50 p-4 divide-y divide-border/50">
              <DetailRow
                icon={User}
                label="Contact Person"
                value={sponsor.contactPersonName}
              />
              <DetailRow
                icon={Briefcase}
                label="Title / Position"
                value={sponsor.contactPersonTitle}
              />
              <DetailRow
                icon={Mail}
                label="Email"
                value={sponsor.contactEmail}
                href={
                  sponsor.contactEmail
                    ? `mailto:${sponsor.contactEmail}`
                    : undefined
                }
                copyable
              />
              <DetailRow
                icon={Phone}
                label="Phone"
                value={sponsor.contactPhone}
                href={
                  sponsor.contactPhone
                    ? `tel:${sponsor.contactPhone}`
                    : undefined
                }
                copyable
              />
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Record Info
            </h4>
            <div className="rounded-xl bg-muted/30 border border-border/50 p-4 divide-y divide-border/50">
              <DetailRow
                icon={Calendar}
                label="Created"
                value={`${formatDate(sponsor.createdAt)} (${formatDateRelative(sponsor.createdAt)})`}
              />
              <DetailRow
                icon={CalendarClock}
                label="Last Updated"
                value={`${formatDate(sponsor.updatedAt)} (${formatDateRelative(sponsor.updatedAt)})`}
              />
              <DetailRow
                icon={FileText}
                label="Record ID"
                value={sponsor.id}
                copyable
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-border/50 bg-card p-4 flex gap-2">
          <Button
            onClick={() => {
              onClose();
              setTimeout(() => onEdit(sponsor), 200);
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-primary to-emerald-600"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Sponsor
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ═══════════════════════════════════════════════════════════
// SPONSOR CARD COMPONENT (FIXED: actions always visible)
// ═══════════════════════════════════════════════════════════

function SponsorCard({
  sponsor,
  onView,
  onEdit,
  onDelete,
}: {
  sponsor: Sponsor;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const TypeIcon = typeIcons[sponsor.type] || Heart;

  return (
    <Card className="group rounded-2xl border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
      {/* Top accent bar */}
      <div
        className={cn(
          'h-1',
          sponsor.type === 'PARTNER'
            ? 'bg-gradient-to-r from-blue-400 to-blue-600'
            : sponsor.type === 'DONOR'
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
              : 'bg-gradient-to-r from-amber-400 to-amber-600',
        )}
      />

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {sponsor.logoUrl ? (
              <img
                src={sponsor.logoUrl}
                alt={sponsor.organizationName}
                className="h-12 w-12 rounded-xl object-cover ring-1 ring-border shadow-sm shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 flex items-center justify-center ring-1 ring-amber-200/50 dark:ring-amber-800/50 shrink-0">
                <TypeIcon className="h-6 w-6 text-amber-500" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">
                {sponsor.organizationName}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge
                  className={cn(
                    'text-[9px] border px-1.5 py-0',
                    typeColors[sponsor.type],
                  )}
                >
                  {SPONSOR_TYPE_MAP[sponsor.type] || sponsor.type}
                </Badge>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                  {SPONSOR_CATEGORY_MAP[sponsor.category] ||
                    sponsor.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions — always visible (no hover gating) */}
          <div className="flex gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={onView}
              title="View details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={onEdit}
              title="Edit"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
              title="Delete Sponsor"
              description={`Are you sure you want to delete "${sponsor.organizationName}"? This action cannot be undone.`}
              onConfirm={onDelete}
              confirmText="Delete"
              destructive
            />
          </div>
        </div>

        {/* Description */}
        {(sponsor.shortDescription || sponsor.description) && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {sponsor.shortDescription || sponsor.description}
          </p>
        )}

        {/* Areas of Support */}
        {sponsor.areasOfSupport && sponsor.areasOfSupport.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {sponsor.areasOfSupport.slice(0, 3).map((area, idx) => (
              <span
                key={idx}
                className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10"
              >
                {area}
              </span>
            ))}
            {sponsor.areasOfSupport.length > 3 && (
              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{sponsor.areasOfSupport.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Contact & Website */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3">
          {sponsor.contactPersonName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {sponsor.contactPersonName}
              {sponsor.contactPersonTitle && (
                <span className="text-muted-foreground/60">
                  · {sponsor.contactPersonTitle}
                </span>
              )}
            </span>
          )}
          {sponsor.contactEmail && (
            <a
              href={`mailto:${sponsor.contactEmail}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Mail className="h-3 w-3" />
              {sponsor.contactEmail}
            </a>
          )}
          {sponsor.contactPhone && (
            <a
              href={`tel:${sponsor.contactPhone}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Phone className="h-3 w-3" />
              {sponsor.contactPhone}
            </a>
          )}
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Globe className="h-3 w-3" />
              Website
            </a>
          )}
        </div>

        {/* Partnership dates */}
        {sponsor.partnershipSince && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            Since {formatDate(sponsor.partnershipSince)}
            {sponsor.isOngoing ? (
              <span className="text-primary font-medium">· Ongoing</span>
            ) : sponsor.partnershipEndDate ? (
              <span>
                — {formatDate(sponsor.partnershipEndDate)}
              </span>
            ) : null}
          </div>
        )}

        {/* Footer badges */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex flex-wrap gap-1.5">
            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold',
                sponsor.isActive
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
              )}
            >
              {sponsor.isActive ? (
                <CheckCircle className="h-2.5 w-2.5" />
              ) : (
                <XCircle className="h-2.5 w-2.5" />
              )}
              {sponsor.isActive ? 'Active' : 'Inactive'}
            </div>
            {sponsor.isFeatured && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Star className="h-2.5 w-2.5" />
                Featured
              </div>
            )}
            {sponsor.sponsorshipLevel && (
              <Badge
                className={cn(
                  'text-[9px] px-2 py-0 border',
                  sponsorshipLevelColors[sponsor.sponsorshipLevel] || '',
                )}
              >
                {sponsor.sponsorshipLevel}
              </Badge>
            )}
            {sponsor.sponsorshipAmount && (
              <span className="text-[9px] font-semibold text-muted-foreground">
                {formatCurrency(sponsor.sponsorshipAmount)}
              </span>
            )}
          </div>
          <span className="text-[9px] text-muted-foreground/50">
            #{sponsor.displayOrder}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM SECTION COMPONENT
// ═══════════════════════════════════════════════════════════

function FormSection({
  title,
  icon: Icon,
  children,
  description,
}: {
  title: string;
  icon: typeof Heart;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

export default function AdminSponsorsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-sponsors'],
    queryFn: () => sponsorsApi.getAll(),
  });
  const createSponsor = useAdminCreateSponsor();
  const updateSponsor = useAdminUpdateSponsor();
  const deleteSponsor = useAdminDeleteSponsor();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SponsorFormData>(defaultForm);
  const [areasInput, setAreasInput] = useState('');

  // Detail sheet
  const [viewingSponsor, setViewingSponsor] = useState<Sponsor | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // View mode & filtering
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const sponsors: Sponsor[] = data?.data || [];

  // Filtered sponsors
  const filteredSponsors = sponsors.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPersonName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || s.type === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && s.isActive) ||
      (filterStatus === 'inactive' && !s.isActive) ||
      (filterStatus === 'featured' && s.isFeatured);

    return matchesSearch && matchesType && matchesStatus;
  });

  // Stats
  const stats = {
    total: sponsors.length,
    active: sponsors.filter((s) => s.isActive).length,
    featured: sponsors.filter((s) => s.isFeatured).length,
    sponsors: sponsors.filter((s) => s.type === 'SPONSOR').length,
    partners: sponsors.filter((s) => s.type === 'PARTNER').length,
  };

  const sponsorTypeEntries = Object.entries(SPONSOR_TYPE_MAP) as [
    string,
    string,
  ][];
  const sponsorCategoryEntries = Object.entries(SPONSOR_CATEGORY_MAP) as [
    string,
    string,
  ][];

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setAreasInput('');
    setShowForm(true);
  };

  const openEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setForm({
      organizationName: sponsor.organizationName || '',
      type: sponsor.type || 'SPONSOR',
      category: sponsor.category || 'CORPORATE_PRIVATE_SECTOR',
      description: sponsor.description || '',
      shortDescription: sponsor.shortDescription || '',
      logoUrl: sponsor.logoUrl || '',
      website: sponsor.website || '',
      contactPersonName: sponsor.contactPersonName || '',
      contactPersonTitle: sponsor.contactPersonTitle || '',
      contactEmail: sponsor.contactEmail || '',
      contactPhone: sponsor.contactPhone || '',
      partnershipSince: toDateInputValue(sponsor.partnershipSince),
      partnershipEndDate: toDateInputValue(sponsor.partnershipEndDate),
      isOngoing: sponsor.isOngoing ?? true,
      sponsorshipLevel: sponsor.sponsorshipLevel || '',
      sponsorshipAmount: sponsor.sponsorshipAmount
        ? String(sponsor.sponsorshipAmount)
        : '',
      areasOfSupport: sponsor.areasOfSupport || [],
      displayOrder: sponsor.displayOrder || 0,
      isActive: sponsor.isActive ?? true,
      isFeatured: sponsor.isFeatured || false,
      showOnAboutPage: sponsor.showOnAboutPage ?? true,
    });
    setAreasInput((sponsor.areasOfSupport || []).join(', '));
    setShowForm(true);
  };

  const openView = (sponsor: Sponsor) => {
    setViewingSponsor(sponsor);
    setShowDetail(true);
  };

  const handleSubmit = () => {
    const submitData: any = {
      ...form,
      areasOfSupport: areasInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      sponsorshipAmount: form.sponsorshipAmount
        ? parseFloat(form.sponsorshipAmount)
        : null,
      partnershipSince: form.partnershipSince
        ? new Date(form.partnershipSince).toISOString()
        : null,
      partnershipEndDate:
        !form.isOngoing && form.partnershipEndDate
          ? new Date(form.partnershipEndDate).toISOString()
          : null,
    };

    // Remove empty strings — send null instead
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '') {
        submitData[key] = null;
      }
    });

    if (editingId) {
      updateSponsor.mutate(
        { id: editingId, data: submitData },
        {
          onSuccess: () => {
            setShowForm(false);
            refetch();
          },
        },
      );
    } else {
      createSponsor.mutate(submitData, {
        onSuccess: () => {
          setShowForm(false);
          refetch();
        },
      });
    }
  };

  const updateForm = (updates: Partial<SponsorFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sponsors & Partners"
        description="Manage foundation sponsors, partners, donors, and collaborators"
        badge="Content Management"
        action={
          <Button
            onClick={openCreate}
            className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Sponsor
          </Button>
        }
      />

      {/* Stats */}
      {sponsors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: Heart, color: 'text-foreground' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-emerald-600' },
            { label: 'Featured', value: stats.featured, icon: Star, color: 'text-amber-600' },
            { label: 'Sponsors', value: stats.sponsors, icon: DollarSign, color: 'text-amber-600' },
            { label: 'Partners', value: stats.partners, icon: Handshake, color: 'text-blue-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50">
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
              <div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters & Search */}
      {sponsors.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl h-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-xl h-10">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Types</SelectItem>
              {sponsorTypeEntries.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-xl h-10">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'h-10 w-10 flex items-center justify-center transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground',
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'h-10 w-10 flex items-center justify-center transition-colors border-l border-border',
                viewMode === 'list'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground',
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : sponsors.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No sponsors yet"
          description="Add your first sponsor or partner to get started."
          action={
            <Button onClick={openCreate} className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Sponsor
            </Button>
          }
        />
      ) : filteredSponsors.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description="Try adjusting your search or filter criteria."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.id}
              sponsor={sponsor}
              onView={() => openView(sponsor)}
              onEdit={() => openEdit(sponsor)}
              onDelete={() =>
                deleteSponsor.mutate(sponsor.id, {
                  onSuccess: () => refetch(),
                })
              }
            />
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {filteredSponsors.map((sponsor) => {
            const TypeIcon = typeIcons[sponsor.type] || Heart;
            return (
              <div
                key={sponsor.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                onClick={() => openView(sponsor)}
              >
                {sponsor.logoUrl ? (
                  <img
                    src={sponsor.logoUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover ring-1 ring-border shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
                    <TypeIcon className="h-5 w-5 text-amber-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold truncate">
                      {sponsor.organizationName}
                    </h3>
                    <Badge
                      className={cn(
                        'text-[9px] border px-1.5 py-0 shrink-0',
                        typeColors[sponsor.type],
                      )}
                    >
                      {SPONSOR_TYPE_MAP[sponsor.type] || sponsor.type}
                    </Badge>
                    {sponsor.sponsorshipLevel && (
                      <Badge
                        className={cn(
                          'text-[9px] border px-1.5 py-0 shrink-0',
                          sponsorshipLevelColors[sponsor.sponsorshipLevel] ||
                            '',
                        )}
                      >
                        {sponsor.sponsorshipLevel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {sponsor.shortDescription ||
                      sponsor.description ||
                      SPONSOR_CATEGORY_MAP[sponsor.category] ||
                      sponsor.category}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {sponsor.areasOfSupport?.length > 0 && (
                    <span className="hidden lg:inline text-[10px] text-muted-foreground">
                      {sponsor.areasOfSupport.length} areas
                    </span>
                  )}
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      sponsor.isActive ? 'bg-emerald-500' : 'bg-red-400',
                    )}
                  />
                  {sponsor.isFeatured && (
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                  {/* Actions — always visible (no hover gating) */}
                  <div className="flex gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(sponsor);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      }
                      title="Delete Sponsor"
                      description={`Delete "${sponsor.organizationName}"?`}
                      onConfirm={() =>
                        deleteSponsor.mutate(sponsor.id, {
                          onSuccess: () => refetch(),
                        })
                      }
                      confirmText="Delete"
                      destructive
                    />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Sheet */}
      <SponsorDetailSheet
        sponsor={viewingSponsor}
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
          setViewingSponsor(null);
        }}
        onEdit={openEdit}
      />

      {/* ═══════════ Create / Edit Form Dialog (FIXED: flex layout for proper scrolling) ═══════════ */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header — fixed at top */}
          <div className="shrink-0 bg-card border-b border-border/50 rounded-t-2xl">
            <div
              className="h-1 rounded-t-2xl"
              style={{ background: 'var(--gradient-premium)' }}
            />
            <DialogHeader className="p-5 pb-4">
              <DialogTitle className="text-lg font-bold font-serif flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="h-5 w-5 text-primary" />
                    Edit Sponsor / Partner
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Sponsor / Partner
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingId
                  ? 'Update all details for this sponsor or partner.'
                  : 'Fill in the details to add a new sponsor or partner.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-8 max-h-[72vh] ">
            {/* ── Logo & Identity ── */}
            <FormSection
              title="Logo & Identity"
              icon={Building2}
              description="Organization branding and basic info"
            >
              <ImageUpload
                onUploadComplete={(r: any) =>
                  updateForm({ logoUrl: r?.imageUrl || '' })
                }
                folder="sponsors"
                currentImage={form.logoUrl}
                label="Organization Logo"
                aspectRatio="square"
                useAdminEndpoint
              />

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Organization Name{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.organizationName}
                  onChange={(e) =>
                    updateForm({ organizationName: e.target.value })
                  }
                  className="rounded-xl h-11"
                  placeholder="Enter organization name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => updateForm({ type: v })}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {sponsorTypeEntries.map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => updateForm({ category: v })}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {sponsorCategoryEntries.map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) => updateForm({ website: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </FormSection>

            {/* ── Descriptions ── */}
            <FormSection
              title="Descriptions"
              icon={FileText}
              description="Short and full descriptions of the organization"
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Short Description
                </Label>
                <Input
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateForm({ shortDescription: e.target.value })
                  }
                  className="rounded-xl h-11"
                  placeholder="Brief one-line summary"
                  maxLength={160}
                />
                <p className="text-[11px] text-muted-foreground">
                  {form.shortDescription.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Full Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    updateForm({ description: e.target.value })
                  }
                  className="rounded-xl min-h-[100px]"
                  placeholder="Detailed description of the organization and their work..."
                  rows={4}
                />
              </div>
            </FormSection>

            {/* ── Partnership Details ── */}
            <FormSection
              title="Partnership Details"
              icon={Handshake}
              description="Partnership dates, levels, and financial info"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Partnership Since
                  </Label>
                  <Input
                    type="date"
                    value={form.partnershipSince}
                    onChange={(e) =>
                      updateForm({ partnershipSince: e.target.value })
                    }
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Partnership End Date
                  </Label>
                  <Input
                    type="date"
                    value={form.partnershipEndDate}
                    onChange={(e) =>
                      updateForm({ partnershipEndDate: e.target.value })
                    }
                    className="rounded-xl h-11"
                    disabled={form.isOngoing}
                  />
                  {form.isOngoing && (
                    <p className="text-[11px] text-muted-foreground italic">
                      Disabled because partnership is marked as ongoing
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                <Switch
                  checked={form.isOngoing}
                  onCheckedChange={(v) => {
                    updateForm({
                      isOngoing: v,
                      partnershipEndDate: v ? '' : form.partnershipEndDate,
                    });
                  }}
                />
                <div>
                  <p className="text-sm font-medium">Ongoing Partnership</p>
                  <p className="text-[11px] text-muted-foreground">
                    This partnership has no defined end date
                  </p>
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sponsorship Level
                  </Label>
                  <Select
                    value={form.sponsorshipLevel}
                    onValueChange={(v) =>
                      updateForm({ sponsorshipLevel: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Platinum">
                        <span className="flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 text-slate-500" />
                          Platinum
                        </span>
                      </SelectItem>
                      <SelectItem value="Gold">
                        <span className="flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          Gold
                        </span>
                      </SelectItem>
                      <SelectItem value="Silver">
                        <span className="flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 text-gray-400" />
                          Silver
                        </span>
                      </SelectItem>
                      <SelectItem value="Bronze">
                        <span className="flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 text-orange-500" />
                          Bronze
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sponsorship Amount (₦)
                  </Label>
                  <Input
                    type="number"
                    value={form.sponsorshipAmount}
                    onChange={(e) =>
                      updateForm({ sponsorshipAmount: e.target.value })
                    }
                    className="rounded-xl h-11"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Areas of Support
                </Label>
                <Input
                  value={areasInput}
                  onChange={(e) => setAreasInput(e.target.value)}
                  className="rounded-xl h-11"
                  placeholder="Training, Funding, Equipment, Market Access"
                />
                <p className="text-[11px] text-muted-foreground">
                  Separate areas with commas
                </p>
                {areasInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {areasInput
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((area, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs rounded-full bg-primary/5 border-primary/15 text-primary"
                        >
                          {area}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </FormSection>

            {/* ── Contact Information ── */}
            <FormSection
              title="Contact Information"
              icon={Users}
              description="Primary contact person for this organization"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Contact Person Name
                  </Label>
                  <Input
                    value={form.contactPersonName}
                    onChange={(e) =>
                      updateForm({ contactPersonName: e.target.value })
                    }
                    className="rounded-xl h-11"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Title / Position
                  </Label>
                  <Input
                    value={form.contactPersonTitle}
                    onChange={(e) =>
                      updateForm({ contactPersonTitle: e.target.value })
                    }
                    className="rounded-xl h-11"
                    placeholder="Director, CEO, Coordinator..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Contact Email
                  </Label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      updateForm({ contactEmail: e.target.value })
                    }
                    className="rounded-xl h-11"
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Contact Phone
                  </Label>
                  <Input
                    value={form.contactPhone}
                    onChange={(e) =>
                      updateForm({ contactPhone: e.target.value })
                    }
                    className="rounded-xl h-11"
                    placeholder="+234..."
                  />
                </div>
              </div>
            </FormSection>

            {/* ── Display Settings ── */}
            <FormSection
              title="Display Settings"
              icon={SlidersHorizontal}
              description="Control visibility and ordering"
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium">Display Order</Label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    updateForm({
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="rounded-xl h-11 w-32"
                  min="0"
                />
                <p className="text-[11px] text-muted-foreground">
                  Lower numbers appear first. 0 = default order.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-[11px] text-muted-foreground">
                        Show this sponsor on the public site
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) => updateForm({ isActive: v })}
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Star className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Featured</p>
                      <p className="text-[11px] text-muted-foreground">
                        Highlight this sponsor prominently
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={form.isFeatured}
                    onCheckedChange={(v) => updateForm({ isFeatured: v })}
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Show on About Page</p>
                      <p className="text-[11px] text-muted-foreground">
                        Display in the About section of the website
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={form.showOnAboutPage}
                    onCheckedChange={(v) =>
                      updateForm({ showOnAboutPage: v })
                    }
                  />
                </label>
              </div>
            </FormSection>
          </div>

          {/* Footer — fixed at bottom */}
          <div className="shrink-0 border-t border-border/50 bg-card p-4 flex justify-end gap-2 rounded-b-2xl">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !form.organizationName ||
                createSponsor.isPending ||
                updateSponsor.isPending
              }
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 min-w-[140px]"
            >
              {(createSponsor.isPending || updateSponsor.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingId ? 'Save Changes' : 'Create Sponsor'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}