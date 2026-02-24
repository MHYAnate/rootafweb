import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className, text }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className,
      )}
    >
      <div className="relative">
        <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
        <div
          className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-20',
            sizeMap[size],
          )}
          style={{ background: 'hsl(var(--primary) / 0.2)' }}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}