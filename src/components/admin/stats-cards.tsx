'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatCardData {
  label: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  href?: string;
  trend?: { value: number; label: string };
  alert?: boolean;
}

interface StatsCardsProps {
  stats: StatCardData[];
  columns?: number;
}

export function StatsCards({ stats, columns = 6 }: StatsCardsProps) {
  const gridClasses: Record<number, string> = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridClasses[columns] || gridClasses[6])}>
      {stats.map((stat) => {
        const content = (
          <Card
            className={cn(
              'rounded-2xl border-border/50 overflow-hidden transition-all duration-300',
              stat.href && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
              stat.alert && 'ring-2 ring-gold-400/50 animate-pulse'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-br',
                    stat.gradient
                  )}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                {stat.trend && (
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      stat.trend.value > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : stat.trend.value < 0
                        ? 'bg-red-50 text-red-700'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {stat.trend.value > 0 ? '+' : ''}{stat.trend.value} {stat.trend.label}
                  </span>
                )}
              </div>
              <div className="text-2xl font-heading font-bold tracking-tight">
                {stat.value ?? 0}
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5 font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        );

        if (stat.href) {
          return (
            <Link key={stat.label} href={stat.href} className="block">
              {content}
            </Link>
          );
        }

        return <div key={stat.label}>{content}</div>;
      })}
    </div>
  );
}