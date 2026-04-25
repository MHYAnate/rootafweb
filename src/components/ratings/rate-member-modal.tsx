// src/components/ratings/rate-member-modal.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RatingForm } from './rating-form';
import { useAuthStore } from '@/store/auth-store';
import { RatingCategory } from '@/lib/api/ratings.api';
import { Star, LogIn, Lock } from 'lucide-react';
import Link from 'next/link';

// ── Category label map ────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<RatingCategory, { title: string; button: string }> = {
  OVERALL_MEMBER:    { title: 'Rate Member',       button: 'Rate Member'  },
  PRODUCT_RATING:    { title: 'Rate Product',      button: 'Rate Product' },
  SERVICE_RATING:    { title: 'Rate Service',      button: 'Rate Service' },
  TOOL_LEASE_RATING: { title: 'Rate Tool / Lease', button: 'Rate Tool'    },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface RateMemberModalProps {
  memberId: string;
  memberName: string;
  ratingCategory?: RatingCategory;
  productId?: string;
  serviceId?: string;
  // toolId intentionally omitted — Rating table has no toolId column.
  // TOOL_LEASE_RATING is identified by memberId + ratingCategory alone.
  trigger?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RateMemberModal({
  memberId,
  memberName,
  ratingCategory = 'OVERALL_MEMBER',
  productId,
  serviceId,
  trigger,
}: RateMemberModalProps) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const labels = CATEGORY_LABELS[ratingCategory];

  // ── Guard: not logged in ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline" className="rounded-xl gap-2 font-medium">
          <LogIn className="h-4 w-4" /> Login to Rate
        </Button>
      </Link>
    );
  }

  // ── Guard: logged in but not a verified client ────────────────────────────
  const canRate =
    user?.userType === 'CLIENT' && user?.verificationStatus === 'VERIFIED';

  if (!canRate) {
    return (
      <Button variant="secondary" disabled className="rounded-xl gap-2 opacity-70">
        <Lock className="h-4 w-4" />
        {user?.userType !== 'CLIENT' ? 'Clients Only' : 'Verification Required'}
      </Button>
    );
  }

  // ── Default trigger ───────────────────────────────────────────────────────
  const defaultTrigger = (
    <Button
      variant="outline"
      className="rounded-xl gap-2 font-medium hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 dark:hover:bg-amber-900/20 dark:hover:border-amber-800 transition-colors"
    >
      <Star className="h-4 w-4 text-amber-500 fill-amber-500/20" />
      {labels.button}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>

      {/*
       * max-h-[85dvh] — leaves safe space on small screens.
       * flex + flex-col — header is fixed, only the inner div scrolls.
       */}
      <DialogContent className="sm:max-w-[460px] rounded-2xl p-0 overflow-hidden flex flex-col max-h-[85dvh] shadow-2xl border-border/60">

        {/* Fixed header */}
        <DialogHeader className="px-6 py-5 border-b bg-background/95 backdrop-blur z-10 shrink-0">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {ratingCategory === 'OVERALL_MEMBER'
              ? `Rate ${memberName}`
              : labels.title}
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Share your honest experience to help the community.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-6">
            <RatingForm
              memberId={memberId}
              ratingCategory={ratingCategory}
              productId={productId}
              serviceId={serviceId}
              // toolId not passed — not a column on the Rating model
              onSuccess={() => setOpen(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}