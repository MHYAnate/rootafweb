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
// import { cn } from '@/lib/utils';

// interface PremiumAvatarProps {
//   name: string;
//   imageUrl?: string;
//   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
//   className?: string;
// }

// const sizeClasses = {
//   xs: 'h-7 w-7 text-[10px]',
//   sm: 'h-9 w-9 text-xs',
//   md: 'h-12 w-12 text-sm',
//   lg: 'h-16 w-16 text-lg',
//   xl: 'h-20 w-20 text-xl',
// };

// export function PremiumAvatar({ name, imageUrl, size = 'md', className }: PremiumAvatarProps) {
//   const initials = name
//     .split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   if (imageUrl) {
//     return (
//       <div className={cn('rounded-xl overflow-hidden flex-shrink-0', sizeClasses[size], className)}>
//         <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
//       </div>
//     );
//   }

//   return (
//     <div
//       className={cn(
//         'rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-primary/20 flex-shrink-0',
//         sizeClasses[size],
//         className
//       )}
//     >
//       {initials}
//     </div>
//   );
// }