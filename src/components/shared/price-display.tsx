import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Props {
  pricingType: string;
  amount?: number | null;
  displayText?: string | null;
  className?: string;
  showBadge?: boolean;
}

export function PriceDisplay({
  pricingType,
  amount,
  displayText,
  className,
  showBadge = false,
}: Props) {
  if (displayText) {
    return <span className={className}>{displayText}</span>;
  }

  if (pricingType === 'NEGOTIABLE') {
    return (
      <span className={cn('flex items-center gap-1.5', className)}>
        Price Negotiable
        {showBadge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium border border-amber-200">
            Negotiable
          </span>
        )}
      </span>
    );
  }

  if (amount) {
    return (
      <span className={cn('flex items-center gap-1.5', className)}>
        {formatCurrency(amount)}
        {pricingType === 'BOTH' && showBadge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium border border-amber-200">
            Negotiable
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={cn('text-muted-foreground italic', className)}>
      Contact for price
    </span>
  );
}