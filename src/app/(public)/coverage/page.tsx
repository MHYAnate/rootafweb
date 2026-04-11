// app/coverage/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePlatformStats } from '@/hooks/use-stats';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Users,
  Crown,
  TrendingUp,
  Search,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Globe,
  Shield,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════
// NIGERIA SVG MAP — All 36 States + FCT
// Each path is simplified but recognizable
// ═══════════════════════════════════════════════════════════

const NIGERIA_STATES: {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}[] = [
  { id: 'AB', name: 'Abia', path: 'M420,520 L440,510 L455,520 L450,540 L435,545 L420,535Z', labelX: 437, labelY: 528 },
  { id: 'AD', name: 'Adamawa', path: 'M500,300 L530,280 L550,300 L545,340 L530,360 L510,350 L500,330Z', labelX: 525, labelY: 320 },
  { id: 'AK', name: 'Akwa Ibom', path: 'M410,580 L430,570 L445,580 L440,600 L420,605 L405,595Z', labelX: 425, labelY: 587 },
  { id: 'AN', name: 'Anambra', path: 'M390,490 L410,480 L420,495 L415,515 L400,520 L385,510Z', labelX: 402, labelY: 500 },
  { id: 'BA', name: 'Bauchi', path: 'M420,250 L460,235 L485,250 L480,285 L455,295 L425,285Z', labelX: 452, labelY: 265 },
  { id: 'BY', name: 'Bayelsa', path: 'M360,590 L380,580 L395,590 L390,610 L375,615 L355,605Z', labelX: 375, labelY: 597 },
  { id: 'BE', name: 'Benue', path: 'M400,400 L440,385 L465,400 L460,430 L440,445 L410,435 L395,420Z', labelX: 430, labelY: 415 },
  { id: 'BO', name: 'Borno', path: 'M500,150 L550,130 L580,150 L575,210 L550,230 L520,220 L500,195Z', labelX: 540, labelY: 180 },
  { id: 'CR', name: 'Cross River', path: 'M450,540 L475,530 L490,545 L485,575 L465,585 L445,570Z', labelX: 467, labelY: 557 },
  { id: 'DE', name: 'Delta', path: 'M340,540 L365,530 L380,545 L375,570 L355,580 L335,565Z', labelX: 357, labelY: 555 },
  { id: 'EB', name: 'Ebonyi', path: 'M430,480 L450,470 L465,485 L460,505 L445,510 L425,500Z', labelX: 445, labelY: 490 },
  { id: 'ED', name: 'Edo', path: 'M330,490 L355,475 L370,490 L365,520 L350,535 L325,520Z', labelX: 347, labelY: 505 },
  { id: 'EK', name: 'Ekiti', path: 'M280,440 L300,430 L315,445 L310,465 L295,470 L275,460Z', labelX: 295, labelY: 450 },
  { id: 'EN', name: 'Enugu', path: 'M410,460 L435,450 L450,465 L445,485 L430,490 L405,480Z', labelX: 427, labelY: 470 },
  { id: 'GO', name: 'Gombe', path: 'M470,260 L500,245 L520,260 L515,285 L495,295 L465,280Z', labelX: 492, labelY: 270 },
  { id: 'IM', name: 'Imo', path: 'M390,530 L410,520 L425,535 L420,555 L405,560 L385,550Z', labelX: 407, labelY: 540 },
  { id: 'JI', name: 'Jigawa', path: 'M380,145 L420,130 L445,145 L440,175 L415,185 L375,175Z', labelX: 410, labelY: 157 },
  { id: 'KD', name: 'Kaduna', path: 'M310,260 L355,240 L385,260 L380,310 L350,325 L310,310 L300,285Z', labelX: 342, labelY: 285 },
  { id: 'KN', name: 'Kano', path: 'M350,175 L395,160 L420,180 L415,215 L390,230 L350,215Z', labelX: 382, labelY: 195 },
  { id: 'KT', name: 'Katsina', path: 'M300,130 L345,115 L375,135 L370,170 L340,185 L300,170Z', labelX: 337, labelY: 150 },
  { id: 'KE', name: 'Kebbi', path: 'M160,200 L210,185 L235,205 L230,245 L200,260 L155,240Z', labelX: 195, labelY: 222 },
  { id: 'KO', name: 'Kogi', path: 'M320,400 L360,385 L385,400 L380,435 L355,450 L320,440 L310,420Z', labelX: 350, labelY: 418 },
  { id: 'KW', name: 'Kwara', path: 'M240,370 L290,355 L320,375 L315,405 L285,420 L245,405 L235,390Z', labelX: 280, labelY: 385 },
  { id: 'LA', name: 'Lagos', path: 'M215,510 L240,500 L255,510 L250,530 L235,535 L210,525Z', labelX: 232, labelY: 517 },
  { id: 'NA', name: 'Nasarawa', path: 'M380,350 L415,335 L440,350 L435,380 L410,390 L375,378Z', labelX: 407, labelY: 362 },
  { id: 'NI', name: 'Niger', path: 'M230,280 L290,260 L320,280 L315,330 L280,350 L240,340 L220,310Z', labelX: 270, labelY: 305 },
  { id: 'OG', name: 'Ogun', path: 'M230,475 L260,460 L280,475 L275,500 L255,510 L225,500Z', labelX: 252, labelY: 485 },
  { id: 'ON', name: 'Ondo', path: 'M265,480 L295,465 L315,480 L310,515 L290,525 L260,510Z', labelX: 287, labelY: 495 },
  { id: 'OS', name: 'Osun', path: 'M260,440 L285,425 L305,440 L300,465 L280,472 L255,460Z', labelX: 280, labelY: 448 },
  { id: 'OY', name: 'Oyo', path: 'M220,400 L260,385 L285,400 L280,440 L255,455 L220,440 L210,420Z', labelX: 250, labelY: 420 },
  { id: 'PL', name: 'Plateau', path: 'M400,310 L435,295 L460,310 L455,345 L435,355 L400,345 L390,330Z', labelX: 427, labelY: 325 },
  { id: 'RI', name: 'Rivers', path: 'M370,565 L395,555 L410,570 L405,595 L385,600 L365,588Z', labelX: 387, labelY: 577 },
  { id: 'SO', name: 'Sokoto', path: 'M180,135 L225,120 L255,140 L250,175 L220,190 L175,172Z', labelX: 215, labelY: 155 },
  { id: 'TA', name: 'Taraba', path: 'M480,350 L510,335 L535,355 L530,400 L505,415 L480,400 L470,375Z', labelX: 505, labelY: 375 },
  { id: 'YO', name: 'Yobe', path: 'M440,170 L480,155 L510,175 L505,210 L480,225 L445,210 L435,190Z', labelX: 475, labelY: 192 },
  { id: 'ZA', name: 'Zamfara', path: 'M235,180 L275,165 L305,185 L300,220 L270,235 L235,220Z', labelX: 270, labelY: 200 },
  { id: 'FC', name: 'FCT Abuja', path: 'M350,355 L372,345 L385,358 L380,378 L365,385 L348,373Z', labelX: 366, labelY: 365 },
];

// ═══════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════

const cubicEase = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: cubicEase },
  }),
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.04, ease: cubicEase },
  }),
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04 } },
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getMemberCountForState(
  stateName: string,
  topStates: { name: string; memberCount: number }[],
): number {
  const found = topStates.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase(),
  );
  return found?.memberCount ?? 0;
}

function getHeatColor(count: number, maxCount: number): string {
  if (count === 0) return 'fill-stone-200 dark:fill-stone-700';
  const ratio = count / Math.max(maxCount, 1);
  if (ratio > 0.7) return 'fill-emerald-600 dark:fill-emerald-500';
  if (ratio > 0.4) return 'fill-emerald-500 dark:fill-emerald-400';
  if (ratio > 0.2) return 'fill-emerald-400 dark:fill-emerald-300';
  if (ratio > 0.05) return 'fill-emerald-300 dark:fill-emerald-200';
  return 'fill-emerald-200 dark:fill-emerald-100';
}

function getRankBadge(rank: number) {
  if (rank === 1) return { icon: Crown, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', label: '#1' };
  if (rank === 2) return { icon: Star, color: 'text-stone-400 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700', label: '#2' };
  if (rank === 3) return { icon: Shield, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800', label: '#3' };
  return null;
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

export default function CoveragePage() {
  const { data: apiStats, isLoading } = usePlatformStats();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = apiStats || {
    coverage: {
      statesCount: 37,
      lgasCount: 150,
      topStates: [
        { name: 'Kaduna', memberCount: 350 },
        { name: 'Kano', memberCount: 45 },
        { name: 'Abuja', memberCount: 30 },
      ],
    },
    members: { total: 500, verified: 480 },
  };

  const topStates = stats.coverage?.topStates || [];
  const maxMemberCount = Math.max(...topStates.map((s: any) => s.memberCount), 1);

  // Build full state list with member counts
  const allStatesWithCounts = useMemo(() => {
    return NIGERIA_STATES.map((state) => ({
      ...state,
      memberCount: getMemberCountForState(state.name, topStates),
    }))
      .sort((a, b) => b.memberCount - a.memberCount);
  }, [topStates]);

  const statesWithMembers = allStatesWithCounts.filter((s) => s.memberCount > 0);
  const totalMembersOnMap = statesWithMembers.reduce((sum, s) => sum + s.memberCount, 0);

  // Filtered list for sidebar
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return allStatesWithCounts;
    return allStatesWithCounts.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allStatesWithCounts, searchQuery]);

  const activeStateData = selectedState
    ? allStatesWithCounts.find((s) => s.id === selectedState)
    : hoveredState
      ? allStatesWithCounts.find((s) => s.id === hoveredState)
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" className="py-0" />
          <p className="text-stone-400 text-sm">Loading coverage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 selection:bg-emerald-900 selection:text-amber-400">
      {/* ═══════════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-stone-950 pt-8 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-600/15 blur-[140px] animate-pulse" />
          <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse delay-1000" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="container mx-auto max-w-7xl relative z-10 px-6">
          <BackButton label="Back to Home" href="/" />

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center mt-8 space-y-5"
          >
            <motion.div variants={fadeInUp} custom={0} className="flex justify-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/25">
                <Globe className="h-7 w-7 text-emerald-950" />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} custom={1}>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400/90 bg-amber-400/[0.08] px-5 py-2.5 rounded-full border border-amber-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                Nationwide Reach
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} custom={2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-tight tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white">
                  Our Coverage
                </span>{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Across Nigeria
                </span>
              </h1>
            </motion.div>

            <motion.p variants={fadeInUp} custom={3} className="text-emerald-100/50 max-w-2xl mx-auto text-base md:text-lg font-light">
              Explore our presence across all 36 states and the FCT. Click on any state to see registered member counts.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              variants={fadeInUp}
              custom={4}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-4"
            >
              {[
                { value: stats.coverage?.statesCount || 0, label: 'States Covered' },
                { value: stats.coverage?.lgasCount || 0, label: 'LGAs Reached', suffix: '+' },
                { value: totalMembersOnMap, label: 'Total Members' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-heading font-bold text-amber-400">
                    {stat.value.toLocaleString()}{stat.suffix || ''}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/40 mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" className="fill-stone-50 dark:fill-stone-950" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MAP + STATE LIST
         ═══════════════════════════════════════════════ */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── MAP ─── */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border-0 shadow-xl shadow-stone-200/50 dark:shadow-stone-900/50 overflow-hidden bg-white dark:bg-stone-900">
                {/* Map header */}
                <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Nigeria Coverage Map</h3>
                      <p className="text-[11px] text-muted-foreground">Click a state to view details</p>
                    </div>
                  </div>

                  {/* State info tooltip */}
                  {activeStateData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40"
                    >
                      <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          {activeStateData.name}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          {activeStateData.memberCount.toLocaleString()} member{activeStateData.memberCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <CardContent className="p-6 md:p-8">
                  {/* SVG Map */}
                  <div className="relative aspect-[4/3] w-full">
                    <svg
                      viewBox="100 100 520 540"
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Map background */}
                      <rect x="100" y="100" width="520" height="540" fill="transparent" />

                      {/* State shapes */}
                      {NIGERIA_STATES.map((state) => {
                        const count = getMemberCountForState(state.name, topStates);
                        const isHovered = hoveredState === state.id;
                        const isSelected = selectedState === state.id;
                        const colorClass = getHeatColor(count, maxMemberCount);

                        return (
                          <g key={state.id}>
                            <path
                              d={state.path}
                              className={cn(
                                'stroke-white dark:stroke-stone-800 transition-all duration-300 cursor-pointer',
                                colorClass,
                                (isHovered || isSelected) && 'stroke-emerald-700 dark:stroke-emerald-400 stroke-[2.5]',
                                isSelected && '!fill-emerald-700 dark:!fill-emerald-500',
                                !isHovered && !isSelected && 'stroke-[1.2]',
                                'hover:brightness-90 dark:hover:brightness-125',
                              )}
                              onMouseEnter={() => setHoveredState(state.id)}
                              onMouseLeave={() => setHoveredState(null)}
                              onClick={() =>
                                setSelectedState(selectedState === state.id ? null : state.id)
                              }
                            />
                            {/* Member count dot for states with members */}
                            {count > 0 && (
                              <g
                                className="pointer-events-none"
                                onMouseEnter={() => setHoveredState(state.id)}
                              >
                                <circle
                                  cx={state.labelX}
                                  cy={state.labelY}
                                  r={Math.max(6, Math.min(14, 6 + (count / maxMemberCount) * 10))}
                                  className={cn(
                                    'fill-emerald-700/80 dark:fill-emerald-400/80 transition-all duration-300',
                                    (isHovered || isSelected) && 'fill-amber-500 dark:fill-amber-400',
                                  )}
                                />
                                <text
                                  x={state.labelX}
                                  y={state.labelY + 1}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  className="fill-white text-[7px] font-bold pointer-events-none select-none"
                                >
                                  {count > 999 ? `${(count / 1000).toFixed(0)}k` : count}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Heat map legend */}
                  <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Members:
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-6 rounded-sm bg-stone-200 dark:bg-stone-700" />
                      <span className="text-[10px] text-muted-foreground">0</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-6 rounded-sm bg-emerald-200" />
                      <span className="text-[10px] text-muted-foreground">Low</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-6 rounded-sm bg-emerald-400" />
                      <span className="text-[10px] text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-6 rounded-sm bg-emerald-600" />
                      <span className="text-[10px] text-muted-foreground">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ─── SIDEBAR: State Rankings ─── */}
            <div className="space-y-6">
              {/* Selected State Detail */}
              {activeStateData && activeStateData.memberCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={activeStateData.id}
                >
                  <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white overflow-hidden">
                    <CardContent className="p-6 relative">
                      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="h-5 w-5 text-emerald-200" />
                          <h3 className="text-lg font-heading font-bold">{activeStateData.name}</h3>
                        </div>
                        <div className="text-4xl font-extrabold font-heading mb-1">
                          {activeStateData.memberCount.toLocaleString()}
                        </div>
                        <p className="text-emerald-200 text-sm">Registered Members</p>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-700"
                              style={{
                                width: `${(activeStateData.memberCount / maxMemberCount) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-emerald-200 font-medium">
                            {((activeStateData.memberCount / totalMembersOnMap) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search states..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl text-sm',
                    'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500',
                    'placeholder:text-muted-foreground/50',
                  )}
                />
              </div>

              {/* Top States Ranking */}
              <Card className="rounded-2xl border-0 shadow-lg bg-white dark:bg-stone-900 overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    State Rankings
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    By registered member count
                  </p>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {filteredStates.map((state, idx) => {
                      const globalRank = allStatesWithCounts.findIndex((s) => s.id === state.id) + 1;
                      const rankBadge = state.memberCount > 0 ? getRankBadge(globalRank) : null;
                      const isActive = selectedState === state.id || hoveredState === state.id;
                      const pct = totalMembersOnMap > 0 ? (state.memberCount / totalMembersOnMap) * 100 : 0;

                      return (
                        <motion.button
                          key={state.id}
                          variants={scaleIn}
                          custom={idx}
                          onClick={() =>
                            setSelectedState(selectedState === state.id ? null : state.id)
                          }
                          onMouseEnter={() => setHoveredState(state.id)}
                          onMouseLeave={() => setHoveredState(null)}
                          className={cn(
                            'w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-300 border-b border-stone-50 dark:border-stone-800/50 last:border-0',
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/30'
                              : 'hover:bg-stone-50 dark:hover:bg-stone-800/50',
                          )}
                        >
                          {/* Rank number */}
                          <div
                            className={cn(
                              'h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0',
                              state.memberCount > 0
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-400',
                            )}
                          >
                            {state.memberCount > 0 ? globalRank : '—'}
                          </div>

                          {/* State info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground truncate">
                                {state.name}
                              </span>
                              {rankBadge && (
                                <span className={cn('text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border', rankBadge.color)}>
                                  {rankBadge.label}
                                </span>
                              )}
                            </div>
                            {state.memberCount > 0 && (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden max-w-[100px]">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.max(pct, 3)}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-muted-foreground tabular-nums">
                                  {pct.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Count */}
                          <div className="text-right shrink-0">
                            <span
                              className={cn(
                                'text-sm font-bold tabular-nums',
                                state.memberCount > 0
                                  ? 'text-foreground'
                                  : 'text-muted-foreground/40',
                              )}
                            >
                              {state.memberCount > 0
                                ? state.memberCount.toLocaleString()
                                : '0'}
                            </span>
                            <p className="text-[9px] text-muted-foreground">members</p>
                          </div>

                          <ChevronRight
                            className={cn(
                              'h-4 w-4 text-muted-foreground/30 shrink-0 transition-all duration-300',
                              isActive && 'text-emerald-500 translate-x-0.5',
                            )}
                          />
                        </motion.button>
                      );
                    })}
                  </motion.div>

                  {filteredStates.length === 0 && (
                    <div className="py-8 text-center">
                      <Search className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No states found</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Summary */}
              <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Growth Summary</h4>
                      <p className="text-[10px] text-muted-foreground">Nationwide presence</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/70 dark:bg-stone-900/50 p-3 text-center">
                      <p className="text-xl font-extrabold text-foreground font-heading">
                        {statesWithMembers.length}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">Active States</p>
                    </div>
                    <div className="rounded-xl bg-white/70 dark:bg-stone-900/50 p-3 text-center">
                      <p className="text-xl font-extrabold text-foreground font-heading">
                        {totalMembersOnMap.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">Total Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500" />
    </div>
  );
}