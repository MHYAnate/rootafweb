'use client';

import { TrendingUp, Users, Package, Wrench, MapPin } from 'lucide-react';

const stats = [
  {
    label: 'Registered Members',
    value: '500+',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Products Listed',
    value: '1,200+',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Services Available',
    value: '300+',
    icon: Wrench,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'States Covered',
    value: '37',
    icon: MapPin,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
];

export function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Our Impact
            </span>
          </div>
          <h2 className="section-title">
            Making a Difference Across Nigeria
          </h2>
          <p className="section-description max-w-lg mx-auto">
            Our growing community of farmers and artisans continues to
            expand every day
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="card-premium p-8 text-center animate-fade-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}