// src/components/ratings/rating-form.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StarInput } from './star-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, SendHorizonal } from 'lucide-react';
import { useCreateRating } from '@/hooks/use-ratings';
import { CreateRatingPayload, RatingCategory } from '@/lib/api/ratings.api';
import { cn } from '@/lib/utils';

// ── Validation ────────────────────────────────────────────────────────────────

const ratingSchema = z.object({
  overallRating:       z.number().min(1, 'Please select an overall rating').max(5),
  qualityRating:       z.number().min(1).max(5).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  valueRating:         z.number().min(1).max(5).optional(),
  timelinessRating:    z.number().min(1).max(5).optional(),
  reviewTitle: z.string().max(120, 'Max 120 chars').optional(),
  reviewText:  z.string().max(2000, 'Max 2000 chars').optional(),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

// ── Sub-rating config per category ───────────────────────────────────────────

interface SubRatingDef {
  name: keyof Pick<
    RatingFormValues,
    'qualityRating' | 'communicationRating' | 'valueRating' | 'timelinessRating'
  >;
  label: string;
  hint: string;
  tier: 'core' | 'secondary';
}

const SUB_RATINGS_BY_CATEGORY: Record<RatingCategory, SubRatingDef[]> = {
  OVERALL_MEMBER: [
    { name: 'qualityRating',       label: 'Quality of Work',  hint: 'How good was the output?',         tier: 'core'      },
    { name: 'communicationRating', label: 'Communication',    hint: 'Were they responsive & clear?',    tier: 'core'      },
    { name: 'valueRating',         label: 'Value for Money',  hint: 'Was it worth the price?',          tier: 'core'      },
    { name: 'timelinessRating',    label: 'Timeliness',       hint: 'Did they deliver on time?',        tier: 'secondary' },
  ],
  PRODUCT_RATING: [
    { name: 'qualityRating',       label: 'Product Quality',  hint: 'Is it well-made & as described?',  tier: 'core'      },
    { name: 'valueRating',         label: 'Value for Money',  hint: 'Was the price fair?',              tier: 'core'      },
    { name: 'communicationRating', label: 'Seller Response',  hint: 'How helpful was the seller?',      tier: 'secondary' },
    { name: 'timelinessRating',    label: 'Delivery Speed',   hint: 'How fast did you receive it?',     tier: 'secondary' },
  ],
  SERVICE_RATING: [
    { name: 'qualityRating',       label: 'Service Quality',  hint: 'How well was the job done?',       tier: 'core'      },
    { name: 'communicationRating', label: 'Communication',    hint: 'Clear updates throughout?',        tier: 'core'      },
    { name: 'timelinessRating',    label: 'Timeliness',       hint: 'Completed within agreed time?',    tier: 'core'      },
    { name: 'valueRating',         label: 'Value for Money',  hint: 'Worth what you paid?',             tier: 'secondary' },
  ],
  TOOL_LEASE_RATING: [
    { name: 'qualityRating',       label: 'Tool Condition',   hint: 'Was it in good working order?',    tier: 'core'      },
    { name: 'valueRating',         label: 'Value for Money',  hint: 'Was the rate reasonable?',         tier: 'core'      },
    { name: 'timelinessRating',    label: 'Availability',     hint: 'Ready when you needed it?',        tier: 'secondary' },
    { name: 'communicationRating', label: 'Owner Response',   hint: 'How helpful was the owner?',       tier: 'secondary' },
  ],
};

const CATEGORY_LABELS: Record<RatingCategory, string> = {
  OVERALL_MEMBER:    'Overall Experience',
  PRODUCT_RATING:    'Product Experience',
  SERVICE_RATING:    'Service Experience',
  TOOL_LEASE_RATING: 'Tool / Lease Experience',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface RatingFormProps {
  memberId: string;
  ratingCategory?: RatingCategory;
  productId?: string;
  serviceId?: string;
  // toolId intentionally omitted — Rating table has no toolId column.
  // TOOL_LEASE_RATING is identified by memberId + ratingCategory alone.
  onSuccess?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RatingForm({
  memberId,
  ratingCategory = 'OVERALL_MEMBER',
  productId,
  serviceId,
  onSuccess,
}: RatingFormProps) {
  const { mutate: createRating, isPending } = useCreateRating(memberId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: { overallRating: 0 },
  });

  const reviewText     = watch('reviewText') ?? '';
  const remainingChars = 2000 - reviewText.length;

  const subRatings      = SUB_RATINGS_BY_CATEGORY[ratingCategory];
  const coreFields      = subRatings.filter((s) => s.tier === 'core');
  const secondaryFields = subRatings.filter((s) => s.tier === 'secondary');

  const onSubmit = (values: RatingFormValues) => {
    const payload: CreateRatingPayload = {
      memberId,
      ratingCategory,
      overallRating:       values.overallRating,
      qualityRating:       values.qualityRating       || undefined,
      communicationRating: values.communicationRating || undefined,
      valueRating:         values.valueRating         || undefined,
      timelinessRating:    values.timelinessRating    || undefined,
      reviewTitle:         values.reviewTitle         || undefined,
      reviewText:          values.reviewText          || undefined,
      // Only attach the context ID that matches the active category.
      // TOOL_LEASE_RATING sends no extra ID — the backend identifies it
      // via memberId + ratingCategory which is sufficient for de-duplication.
      ...(ratingCategory === 'PRODUCT_RATING' && productId && { productId }),
      ...(ratingCategory === 'SERVICE_RATING' && serviceId && { serviceId }),
    };

    createRating(payload, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* ── Section 1: Overall rating ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-amber-100/50 px-5 py-4 shadow-sm dark:border-amber-900/50 dark:from-amber-950/40 dark:to-amber-900/20">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-3">
          {CATEGORY_LABELS[ratingCategory]}
        </p>
        <Controller
          name="overallRating"
          control={control}
          render={({ field }) => (
            <StarInput
              label="Overall Rating"
              required
              size="lg"
              value={field.value}
              onChange={field.onChange}
              disabled={isPending}
              error={errors.overallRating?.message}
            />
          )}
        />
      </div>

      {/* ── Section 2: Core sub-ratings ───────────────────────────────────── */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-muted/40 px-5 py-2.5 border-b border-border/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Key Criteria
          </p>
        </div>
        <div className="divide-y divide-border/50 px-5">
          {coreFields.map(({ name, label, hint }) => (
            <div key={name} className="py-3.5 flex items-center justify-between gap-4">
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight">{label}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                        {hint}
                      </p>
                    </div>
                    <StarInput
                      size="sm"
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </>
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Secondary sub-ratings ──────────────────────────────── */}
      {secondaryFields.length > 0 && (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-5 py-4 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Additional Feedback
            <span className="ml-1.5 font-normal normal-case text-muted-foreground/70">
              (optional)
            </span>
          </p>
          <div className="space-y-3.5">
            {secondaryFields.map(({ name, label, hint }) => (
              <div key={name}>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight text-foreground/80">
                          {label}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 leading-tight mt-1">
                          {hint}
                        </p>
                      </div>
                      <StarInput
                        size="sm"
                        value={field.value ?? 0}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </div>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 4: Written review ──────────────────────────────────────── */}
      <div className="space-y-4 px-1">
        <div>
          <Label
            htmlFor="reviewTitle"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Review Title{' '}
            <span className="ml-1 font-normal normal-case opacity-70">(optional)</span>
          </Label>
          <Input
            id="reviewTitle"
            placeholder="Summarize your experience..."
            disabled={isPending}
            className="mt-1.5 h-10 text-sm rounded-xl bg-background transition-shadow focus-visible:ring-amber-500/30"
            {...register('reviewTitle')}
          />
          {errors.reviewTitle && (
            <p className="text-xs text-destructive mt-1.5">{errors.reviewTitle.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="reviewText"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Your Review{' '}
            <span className="ml-1 font-normal normal-case opacity-70">(optional)</span>
          </Label>
          <Textarea
            id="reviewText"
            placeholder="What went well? What could be improved?"
            rows={4}
            disabled={isPending}
            className="mt-1.5 resize-none text-sm rounded-xl bg-background transition-shadow focus-visible:ring-amber-500/30"
            {...register('reviewText')}
          />
          <div className="flex justify-between items-center mt-1.5 px-1">
            {errors.reviewText ? (
              <p className="text-xs text-destructive">{errors.reviewText.message}</p>
            ) : (
              <span />
            )}
            <p
              className={cn(
                'text-[11px] transition-colors duration-300',
                remainingChars < 100
                  ? 'text-amber-600 font-medium'
                  : 'text-muted-foreground/70',
              )}
            >
              {remainingChars} characters remaining
            </p>
          </div>
        </div>
      </div>

      {/* ── Submit ──────────────────────────────────────────────────────────── */}
      <div className="pt-2 pb-1">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl gap-2 h-11 text-sm font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Review...</>
          ) : (
            <><SendHorizonal className="h-4 w-4" /> Submit Rating</>
          )}
        </Button>
      </div>
    </form>
  );
}