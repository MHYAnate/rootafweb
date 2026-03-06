// src/components/tools/tool-stats-bar.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Eye, Package, TrendingUp } from 'lucide-react';

interface ToolStatsBarProps {
  stats: {
    total: number;
    active: number;
    totalViews: number;
    forSale: number;
    forLease: number;
  };
}

export function ToolStatsBar({ stats }: ToolStatsBarProps) {
  const items = [
    {
      label: 'Total Tools',
      value: stats.total,
      icon: Wrench,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: Package,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'For Sale',
      value: stats.forSale,
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}