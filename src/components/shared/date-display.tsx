import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/format';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  date: string | Date | null | undefined;
  format?: 'date' | 'datetime' | 'relative';
  showIcon?: boolean;
  className?: string;
}

export function DateDisplay({
  date,
  format = 'date',
  showIcon = false,
  className,
}: Props) {
  const formatted =
    format === 'relative'
      ? formatRelativeTime(date as string)
      : format === 'datetime'
        ? formatDateTime(date)
        : formatDate(date);

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      {showIcon && <Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
      {formatted}
    </span>
  );
}