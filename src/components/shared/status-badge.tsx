// import { cn } from '@/lib/utils';
// import { VERIFICATION_STATUS_MAP } from '@/lib/constants';

// interface Props {
//   status: string;
//   className?: string;
//   showDot?: boolean;
// }

// export function StatusBadge({ status, className, showDot = true }: Props) {
//   const config = VERIFICATION_STATUS_MAP[status] || {
//     label: status,
//     color: 'text-gray-700',
//     bgClass: 'bg-gray-50 border-gray-200',
//     dotColor: 'bg-gray-400',
//   };

//   return (
//     <span
//       className={cn(
//         'badge-status border gap-1.5',
//         config.bgClass,
//         config.color,
//         className,
//       )}
//     >
//       {showDot && (
//         <span
//           className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)}
//         />
//       )}
//       {config.label}
//     </span>
//   );
// }
import { cn } from '@/lib/utils';
import { VERIFICATION_STATUS_MAP } from '@/lib/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = VERIFICATION_STATUS_MAP[status];

  if (!config) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
          'bg-gray-50 border-gray-200 text-gray-700',
          className,
        )}
      >
        {status?.replace(/_/g, ' ') || 'Unknown'}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.bgClass,
        config.color,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}