import Image from 'next/image';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils';

interface Props {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-28 w-28 text-2xl',
};

export function PremiumAvatar({
  src,
  name,
  size = 'md',
  verified = false,
  className,
}: Props) {
  const colorClass = generateAvatarColor(name);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-semibold overflow-hidden',
          'ring-2 ring-white shadow-md',
          sizeClasses[size],
          !src && colorClass,
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          getInitials(name)
        )}
      </div>
      {verified && (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5',
            size === 'sm' && 'scale-75',
          )}
        >
          <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}