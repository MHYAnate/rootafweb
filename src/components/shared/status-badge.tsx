import { cn } from '@/lib/utils';
import { VERIFICATION_STATUS_MAP } from '@/lib/constants';

interface Props {
  status: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: Props) {
  const config = VERIFICATION_STATUS_MAP[status] || {
    label: status,
    color: 'text-gray-700',
    bgClass: 'bg-gray-50 border-gray-200',
    dotColor: 'bg-gray-400',
  };

  return (
    <span
      className={cn(
        'badge-status border gap-1.5',
        config.bgClass,
        config.color,
        className,
      )}
    >
      {showDot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)}
        />
      )}
      {config.label}
    </span>
  );
}