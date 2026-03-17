'use client';

import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import { sponsorsApi } from '@/lib/api/sponsors.api';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Globe,
  Quote,
  ArrowUpRight,
  Handshake,
  Building2,
  ExternalLink,
  CalendarDays,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/* ─── Animation Variants ─── */
const cubicEase = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: cubicEase },
  }),
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: cubicEase },
  }),
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const valueIcons = [Heart, Shield, Star, Globe, Zap, Users, Award, Crown];

/* ─── Sponsor Types ─── */
interface Sponsor {
  id: string;
  organizationName: string;
  logoUrl: string | null;
  logoThumbnailUrl: string | null;
  type: 'PARTNER' | 'SPONSOR';
  category: string;
  description: string | null;
  shortDescription: string | null;
  website: string | null;
  sponsorshipLevel: string | null;
  areasOfSupport: string[];
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  showOnAboutPage: boolean;
  partnershipSince: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  GOVERNMENT_AGENCY: 'Government Agency',
  NON_GOVERNMENTAL_ORGANIZATION: 'NGO',
  CORPORATE_PRIVATE_SECTOR: 'Corporate / Private Sector',
  INTERNATIONAL_ORGANIZATION: 'International Organization',
  ACADEMIC_INSTITUTION: 'Academic Institution',
  COMMUNITY_BASED_ORGANIZATION: 'Community Organization',
  FINANCIAL_INSTITUTION: 'Financial Institution',
  MEDIA_ORGANIZATION: 'Media',
  RELIGIOUS_ORGANIZATION: 'Religious Organization',
  INDIVIDUAL: 'Individual',
};

const LEVEL_STYLES: Record<string, { badge: string; icon: string }> = {
  Platinum: {
    badge:
      'bg-gradient-to-r from-slate-300/20 to-zinc-200/20 border-slate-400/30 text-slate-200',
    icon: '💎',
  },
  Gold: {
    badge:
      'bg-gradient-to-r from-amber-400/20 to-yellow-300/20 border-amber-400/30 text-amber-300',
    icon: '🏆',
  },
  Silver: {
    badge:
      'bg-gradient-to-r from-gray-300/20 to-gray-200/20 border-gray-400/30 text-gray-300',
    icon: '🥈',
  },
  Bronze: {
    badge:
      'bg-gradient-to-r from-orange-400/20 to-amber-300/20 border-orange-400/30 text-orange-300',
    icon: '🥉',
  },
};

/* ─── Sponsor Logo ─── */
function SponsorLogo({
  sponsor,
  size = 'md',
}: {
  sponsor: Sponsor;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = {
    sm: 'h-12 w-12 rounded-xl text-sm',
    md: 'h-16 w-16 rounded-2xl text-base',
    lg: 'h-20 w-20 rounded-2xl text-xl',
  };

  const colors = [
    'from-emerald-500/80 to-teal-600/80',
    'from-blue-500/80 to-indigo-600/80',
    'from-violet-500/80 to-purple-600/80',
    'from-amber-500/80 to-orange-600/80',
    'from-rose-500/80 to-pink-600/80',
    'from-cyan-500/80 to-sky-600/80',
  ];

  if (sponsor.logoThumbnailUrl || sponsor.logoUrl) {
    return (
      <div
        className={cn(
          sizeMap[size],
          'overflow-hidden shrink-0 border border-white/10 bg-white/5',
        )}
      >
        <img
          src={sponsor.logoThumbnailUrl || sponsor.logoUrl || ''}
          alt={sponsor.organizationName}
          className="w-full h-full object-contain p-2"
        />
      </div>
    );
  }

  const colorIndex = sponsor.organizationName.charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        sizeMap[size],
        'shrink-0 flex items-center justify-center bg-gradient-to-br text-white font-bold shadow-inner',
        colors[colorIndex],
      )}
    >
      {sponsor.organizationName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()}
    </div>
  );
}

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const [sponsorFilter, setSponsorFilter] = useState<'ALL' | 'SPONSOR' | 'PARTNER'>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: aboutApi.getAll,
  });

  const { data: sponsorsData, isLoading: sponsorsLoading } = useQuery({
    queryKey: ['sponsors-about'],
    queryFn: () => sponsorsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });

  /* ─── Loading State ─── */
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 animate-pulse flex items-center justify-center">
              <Crown className="h-10 w-10 text-emerald-950" />
            </div>
            <div className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-amber-400/20 animate-ping" />
          </div>
          <LoadingSpinner size="lg" text="" className="py-0" />
          <p className="text-emerald-200/60 text-sm tracking-[0.3em] uppercase font-medium">
            Crafting Excellence
          </p>
        </div>
      </div>
    );

  /* ─── Data Extraction ─── */
  const aboutData = data?.data || {};
  const contentArray: any[] = aboutData.content || [];
  const leadership: any[] = aboutData.leadership || [];
  const objectives: any[] = aboutData.objectives || [];
  const contact: any[] = aboutData.contact || [];

  const contentMap: Record<string, any> = {};
  contentArray.forEach((item: any) => {
    contentMap[item.sectionKey] = item;
  });

  const mission = contentMap['MISSION_STATEMENT'];
  const vision = contentMap['VISION_STATEMENT'];
  const overview = contentMap['OVERVIEW'];
  const coreValues = contentMap['CORE_VALUES'];
  const primaryContact = contact.find((c: any) => c.isPrimary) || contact[0];

  const activeLeaders = leadership
    .filter((l: any) => l.isActive && l.showOnAboutPage)
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  const sortedObjectives = [...objectives].sort(
    (a: any, b: any) => a.objectiveNumber - b.objectiveNumber,
  );

  /* ─── Sponsors Data ─── */
  const allSponsors: Sponsor[] = (sponsorsData?.data || [])
    .filter((s: Sponsor) => s.isActive && s.showOnAboutPage)
    .sort((a: Sponsor, b: Sponsor) => a.displayOrder - b.displayOrder);

  const sponsors = allSponsors.filter((s) => s.type === 'SPONSOR');
  const partners = allSponsors.filter((s) => s.type === 'PARTNER');
  const featuredSponsors = allSponsors.filter((s) => s.isFeatured);

  const filteredSponsors =
    sponsorFilter === 'ALL'
      ? allSponsors
      : allSponsors.filter((s) => s.type === sponsorFilter);

  return (
    <div className="bg-stone-50 min-h-screen overflow-hidden selection:bg-emerald-900 selection:text-amber-400">
      {/* ═══════════════════════════════════════════════
          HERO — Full-screen Cinematic with Parallax
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="absolute -top-40 left-1/4 h-[700px] w-[700px] rounded-full bg-emerald-600/15 blur-[140px] animate-pulse" />
          <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-amber-400/[0.03] blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-amber-400/30"
              style={{ top: `${15 + i * 14}%`, left: `${8 + i * 16}%` }}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <div className="absolute top-20 left-0 w-[2px] h-32 bg-gradient-to-b from-amber-400/40 to-transparent" />
        <div className="absolute top-20 right-0 w-[2px] h-32 bg-gradient-to-b from-amber-400/40 to-transparent" />

        <div className="container mx-auto max-w-7xl relative z-10 text-center px-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/25 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Crown className="h-10 w-10 text-emerald-950" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-300 animate-ping" />
                <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-emerald-400/60" />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} custom={1}>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400/90 bg-amber-400/[0.08] backdrop-blur-sm px-5 py-2.5 rounded-full border border-amber-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                Legacy &amp; Excellence
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} custom={2} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[0.9] tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white">
                  About
                </span>
                <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Our Foundation
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              custom={3}
              className="text-emerald-100/50 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed"
            >
              {overview?.title ||
                'Empowering artisan farmers across Nigeria with world-class resources, sustainable practices, and transformative community development.'}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={4}
              className="flex flex-wrap items-center justify-center gap-10 md:gap-16 pt-8"
            >
              {[
                {
                  value: sortedObjectives.length || '10+',
                  label: 'Key Objectives',
                },
                { value: activeLeaders.length || '8+', label: 'Leaders' },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <p className="text-3xl md:text-4xl font-heading font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-900/40 mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-emerald-700/50 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-1 h-2 bg-amber-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z"
              className="fill-stone-50"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OVERVIEW
         ═══════════════════════════════════════════════ */}
      {overview && (
        <section className="py-28 md:py-36">
          <div className="container mx-auto max-w-6xl px-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
            >
              <motion.div
                variants={fadeInUp}
                custom={0}
                className="lg:col-span-4"
              >
                <div className="lg:sticky lg:top-28">
                  <span className="text-amber-600 text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
                    Our Story
                  </span>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 leading-tight mb-6">
                    Cultivating{' '}
                    <span className="text-emerald-700">Legacy</span> Through
                    Purpose
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full" />
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                custom={1}
                className="lg:col-span-8"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
                  <Card className="relative rounded-3xl border-0 bg-white/90 backdrop-blur-xl shadow-2xl shadow-stone-200/50 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500" />
                    <CardContent className="p-10 md:p-14">
                      <Quote className="h-12 w-12 text-emerald-100 mb-6" />
                      <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-stone-900">
                        {overview.title}
                      </h3>
                      <p className="text-stone-600 leading-[1.9] text-base md:text-lg whitespace-pre-line font-light first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:text-emerald-800 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                        {overview.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          MISSION & VISION
         ═══════════════════════════════════════════════ */}
      {(mission || vision) && (
        <section className="py-32 bg-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_50%)]" />

          <div className="container mx-auto max-w-6xl px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">
                Purpose &amp; Direction
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
              {mission && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="lg:pr-12"
                >
                  <Card className="bg-stone-800/50 backdrop-blur-xl border-stone-700/50 rounded-3xl h-full hover:bg-stone-800/70 transition-all duration-500 group overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-emerald-400 to-transparent" />
                    <CardContent className="p-10 md:p-12 h-full flex flex-col relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-900/50">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-amber-400 text-sm font-bold tracking-[0.3em] uppercase mb-4">
                        Mission
                      </h3>
                      <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                        {mission.title || 'Our Mission'}
                      </h2>
                      <p className="text-stone-300 leading-relaxed text-lg font-light flex-grow">
                        {mission.content}
                      </p>
                      <div className="mt-8 flex items-center gap-2 text-emerald-400 group-hover:gap-4 transition-all duration-300">
                        <span className="text-sm font-medium">
                          Discover our impact
                        </span>
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {vision && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="lg:pl-12 lg:mt-20"
                >
                  <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl border-amber-500/20 rounded-3xl h-full hover:border-amber-500/40 transition-all duration-500 group overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-amber-400 to-transparent" />
                    <CardContent className="p-10 md:p-12 h-full flex flex-col relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-amber-900/50">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-amber-400 text-sm font-bold tracking-[0.3em] uppercase mb-4">
                        Vision
                      </h3>
                      <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                        {vision.title || 'Our Vision'}
                      </h2>
                      <p className="text-stone-300 leading-relaxed text-lg font-light flex-grow">
                        {vision.content}
                      </p>
                      <div className="mt-8 flex items-center gap-2 text-amber-400 group-hover:gap-4 transition-all duration-300">
                        <span className="text-sm font-medium">
                          See the future
                        </span>
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CORE VALUES
         ═══════════════════════════════════════════════ */}
      {coreValues && (
        <section className="relative py-28 md:py-36 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald-400/[0.05] blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(251,191,36,0.4) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-heading font-bold text-white/[0.02] select-none tracking-tighter pointer-events-none">
            VALUES
          </div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="container mx-auto max-w-7xl relative z-10 px-6"
          >
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400/80 bg-amber-400/[0.08] px-5 py-2.5 rounded-full border border-amber-400/15 mb-5">
                <Heart className="h-3 w-3" />
                What We Stand For
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Our Core{' '}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Values
                </span>
              </h2>
              <p className="text-emerald-200/40 max-w-xl mx-auto mt-4 text-base font-light">
                The principles that guide every decision we make and every life
                we touch
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              custom={1}
              className="max-w-5xl mx-auto"
            >
              <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                <div className="p-10 md:p-14">
                  {coreValues.content?.includes('\n') ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {coreValues.content
                        .split('\n')
                        .filter((v: string) => v.trim())
                        .map((value: string, i: number) => {
                          const IconComponent =
                            valueIcons[i % valueIcons.length];
                          return (
                            <motion.div
                              key={i}
                              variants={scaleIn}
                              custom={i}
                              className="group flex items-start gap-4 p-5 rounded-2xl border border-white/[0.04] hover:border-amber-400/20 hover:bg-white/[0.02] transition-all duration-500"
                            >
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center flex-shrink-0 group-hover:from-amber-400/30 group-hover:to-amber-600/20 transition-all duration-500">
                                <IconComponent className="h-5 w-5 text-amber-400" />
                              </div>
                              <p className="text-emerald-100/70 leading-relaxed text-sm pt-2 font-light">
                                {value.replace(/^-\s*/, '').trim()}
                              </p>
                            </motion.div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-emerald-100/60 leading-[2] text-lg md:text-xl whitespace-pre-line font-light text-center font-serif italic">
                      {coreValues.content}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          OBJECTIVES
         ═══════════════════════════════════════════════ */}
      {sortedObjectives.length > 0 && (
        <section className="py-28 md:py-36 bg-gradient-to-b from-stone-100/50 to-stone-50">
          <div className="container mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16"
            >
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200/60 mb-4">
                  <Award className="h-3 w-3" />
                  Strategic Pillars
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-stone-900">
                  Foundation{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    Objectives
                  </span>
                </h2>
                <p className="text-stone-500 max-w-xl mt-4 text-base font-light">
                  Clear goals that drive measurable impact in communities across
                  the nation
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-stone-400 font-medium tracking-wide uppercase">
                {sortedObjectives.length} Key Initiatives
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sortedObjectives.map((obj: any, index: number) => (
                <motion.div key={obj.id} variants={scaleIn} custom={index}>
                  <Card className="group relative rounded-3xl border-0 bg-white shadow-lg shadow-stone-200/50 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 overflow-hidden min-h-[220px] hover:-translate-y-1">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -right-4 -bottom-8 text-[120px] font-black text-stone-50 group-hover:text-emerald-50 transition-colors duration-500 select-none pointer-events-none z-0">
                      {obj.objectiveNumber}
                    </div>
                    <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-500">
                          <span className="text-sm font-bold text-white font-heading">
                            {String(obj.objectiveNumber).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-lg text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors">
                          {obj.title}
                        </h3>
                        <p className="text-sm text-stone-500 leading-relaxed font-light line-clamp-4">
                          {obj.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-emerald-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 mt-6" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          LEADERSHIP
         ═══════════════════════════════════════════════ */}
      {activeLeaders.length > 0 && (
        <section className="py-28 md:py-36 bg-stone-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.05),transparent_60%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700/30 to-transparent" />

          <div className="container mx-auto max-w-7xl px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-400/[0.06] px-4 py-2 rounded-full border border-amber-400/15 mb-5">
                <Users className="h-3 w-3" />
                Executive Board
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                Meet the{' '}
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Visionaries
                </span>
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto text-base font-light">
                Dedicated leaders committed to transforming lives and building
                sustainable futures
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto rounded-full mt-8" />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {activeLeaders.map((leader: any, idx: number) => (
                <motion.div key={leader.id} variants={scaleIn} custom={idx}>
                  <div className="group relative h-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-amber-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700" />
                    <Card className="relative bg-stone-900/80 backdrop-blur border-stone-800/80 rounded-2xl overflow-hidden h-full group-hover:border-stone-700/80 transition-all duration-500">
                      <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="relative mt-2 mb-5">
                          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-emerald-500/30 to-amber-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />
                          <div className="relative">
                            <div className="h-24 w-24 rounded-full ring-[3px] ring-stone-800 group-hover:ring-stone-700 transition-all duration-500 overflow-hidden">
                              <PremiumAvatar
                                name={leader.fullName}
                                src={
                                  leader.photoUrl || leader.photoThumbnailUrl
                                }
                                size="xl"
                                className="h-full w-full rounded-full object-cover"
                              />
                            </div>
                            {leader.isChairman && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-stone-900 shadow-lg shadow-amber-500/20">
                                <Star className="h-3 w-3 text-white fill-white" />
                              </div>
                            )}
                            {leader.isFounder && !leader.isChairman && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-stone-900 shadow-lg shadow-amber-500/20">
                                <Crown className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          <h3 className="text-[15px] font-heading font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors duration-300">
                            {leader.title && (
                              <span className="text-stone-500 font-medium">
                                {leader.title}{' '}
                              </span>
                            )}
                            {leader.fullName}
                          </h3>
                          <p className="text-xs font-semibold tracking-widest uppercase text-amber-400/80">
                            {leader.position}
                          </p>
                        </div>
                        <div className="w-8 h-px bg-stone-800 group-hover:w-12 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-amber-500 transition-all duration-500 mb-3" />
                        {leader.shortBio && (
                          <p className="text-[13px] text-stone-500 leading-relaxed line-clamp-3 font-light mb-4 group-hover:text-stone-400 transition-colors duration-300">
                            {leader.shortBio}
                          </p>
                        )}
                        <div className="flex flex-wrap justify-center gap-1.5 mt-auto pt-1">
                          {leader.isFounder && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/15 text-amber-400 text-[10px] font-bold tracking-wider uppercase">
                              <Crown className="h-2.5 w-2.5" />
                              Founder
                            </span>
                          )}
                          {leader.isTrustee && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                              <Shield className="h-2.5 w-2.5" />
                              Trustee
                            </span>
                          )}
                          {leader.isChairman && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-500/10 border border-stone-500/15 text-stone-300 text-[10px] font-bold tracking-wider uppercase">
                              <Award className="h-2.5 w-2.5" />
                              Chairman
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SPONSORS & PARTNERS
         ═══════════════════════════════════════════════ */}
      {allSponsors.length > 0 && (
        <section
          id="partners"
          className="py-28 md:py-36 bg-gradient-to-b from-stone-100/80 via-stone-50 to-white relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-400/[0.04] blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-heading font-bold text-stone-100 select-none tracking-tighter pointer-events-none">
            PARTNERS
          </div>

          <div className="container mx-auto max-w-7xl px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700 bg-amber-50 px-5 py-2.5 rounded-full border border-amber-200/60 mb-6">
                <Handshake className="h-3.5 w-3.5" />
                Building Together
              </span>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-stone-900 leading-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  Sponsors
                </span>{' '}
                &amp;{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  Partners
                </span>
              </h2>

              <p className="text-stone-500 max-w-2xl mx-auto mt-5 text-base md:text-lg font-light leading-relaxed">
                We are honored to collaborate with organizations dedicated to
                transforming agriculture and empowering communities across
                Nigeria.
              </p>

              <div className="w-20 h-0.5 bg-gradient-to-r from-amber-500 to-emerald-600 mx-auto rounded-full mt-8" />

              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 md:gap-14 mt-10">
                {[
                  {
                    count: partners.length,
                    label: 'Partners',
                    icon: Handshake,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
                  },
                  {
                    count: sponsors.length,
                    label: 'Sponsors',
                    icon: Heart,
                    color: 'text-amber-600 bg-amber-50 border-amber-200/60',
                  },
                  {
                    count: featuredSponsors.length,
                    label: 'Featured',
                    icon: Star,
                    color: 'text-violet-600 bg-violet-50 border-violet-200/60',
                  },
                ].map(({ count, label, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3 group cursor-default">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110',
                        color,
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-heading font-bold text-stone-900 leading-none">
                        {count}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold mt-0.5">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Filter Tabs */}
            {sponsors.length > 0 && partners.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-center mb-12"
              >
                <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-inner">
                  {(
                    [
                      { key: 'ALL', label: 'All', count: allSponsors.length },
                      {
                        key: 'PARTNER',
                        label: 'Partners',
                        count: partners.length,
                      },
                      {
                        key: 'SPONSOR',
                        label: 'Sponsors',
                        count: sponsors.length,
                      },
                    ] as const
                  ).map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setSponsorFilter(key)}
                      className={cn(
                        'relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
                        sponsorFilter === key
                          ? 'bg-white text-stone-900 shadow-md shadow-stone-200/60'
                          : 'text-stone-500 hover:text-stone-700 hover:bg-white/50',
                      )}
                    >
                      {label}
                      <span
                        className={cn(
                          'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors',
                          sponsorFilter === key
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-200/60 text-stone-400',
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Featured Spotlight */}
            {featuredSponsors.length > 0 && sponsorFilter === 'ALL' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                    Featured Partners & Sponsors
                  </span>
                </div>
                <div
                  className={cn(
                    'grid gap-6',
                    featuredSponsors.length === 1
                      ? 'grid-cols-1 max-w-3xl'
                      : 'grid-cols-1 md:grid-cols-2',
                  )}
                >
                  {featuredSponsors.map((sponsor, i) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <FeaturedSponsorCardLight sponsor={sponsor} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sponsor Grid */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredSponsors
                .filter(
                  (s) =>
                    !(sponsorFilter === 'ALL' && s.isFeatured),
                )
                .map((sponsor, index) => (
                  <motion.div
                    key={sponsor.id}
                    variants={scaleIn}
                    custom={index}
                  >
                    <SponsorCardLight sponsor={sponsor} />
                  </motion.div>
                ))}
            </motion.div>

            {/* Bottom flourish */}
            <div className="flex justify-center mt-16">
              <div className="flex items-center gap-3 text-stone-300">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
                <Handshake className="h-5 w-5 text-amber-400/50" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CONTACT
         ═══════════════════════════════════════════════ */}
      {primaryContact && (
        <section className="py-28 md:py-36">
          <div className="container mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="rounded-[2.5rem] border-0 bg-emerald-950 text-white shadow-2xl shadow-emerald-950/30 overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-500/15 blur-[80px]" />
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                <CardContent className="p-12 md:p-20 flex flex-col lg:flex-row justify-between items-center gap-14 relative z-10">
                  <div className="max-w-md text-center lg:text-left">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400/80 bg-amber-400/[0.08] px-5 py-2.5 rounded-full border border-amber-400/15 mb-6">
                      <Mail className="h-3 w-3" />
                      Get In Touch
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                      Let&apos;s{' '}
                      <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                        Connect
                      </span>
                    </h2>
                    <p className="text-emerald-100/60 font-light text-lg">
                      We welcome partnerships and inquiries from those who share
                      our vision for agricultural excellence.
                    </p>
                  </div>

                  <div className="w-full lg:w-auto flex flex-col gap-8 bg-white/[0.04] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-sm">
                    {primaryContact.address && (
                      <div className="flex items-start gap-4 group">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/25 transition-colors duration-500">
                          <MapPin className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/50 mb-1 font-bold">
                            Headquarters
                          </p>
                          <p className="text-white font-medium leading-relaxed">
                            {primaryContact.address}
                            {(primaryContact.city || primaryContact.state) && (
                              <>
                                <br />
                                {[primaryContact.city, primaryContact.state]
                                  .filter(Boolean)
                                  .join(', ')}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {primaryContact.phoneNumber1 && (
                      <div className="flex items-start gap-4 group">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/25 transition-colors duration-500">
                          <Phone className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/50 mb-1 font-bold">
                            Direct Line
                          </p>
                          <a
                            href={`tel:${primaryContact.phoneNumber1}`}
                            className="text-white font-medium hover:text-amber-400 transition-colors"
                          >
                            {primaryContact.phoneNumber1}
                          </a>
                        </div>
                      </div>
                    )}

                    {primaryContact.email && (
                      <div className="flex items-start gap-4 group">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/25 transition-colors duration-500">
                          <Mail className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/50 mb-1 font-bold">
                            Electronic Mail
                          </p>
                          <a
                            href={`mailto:${primaryContact.email}`}
                            className="text-white font-medium hover:text-amber-400 transition-colors break-all"
                          >
                            {primaryContact.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center mt-16">
              <div className="flex items-center gap-3 text-stone-300/30">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/30" />
                <Crown className="h-5 w-5 text-amber-400/40" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/30" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURED SPONSOR CARD (Light Theme – For About Page)
   ═══════════════════════════════════════════════════════════ */

function FeaturedSponsorCardLight({ sponsor }: { sponsor: Sponsor }) {
  const isPartner = sponsor.type === 'PARTNER';
  const levelStyle = sponsor.sponsorshipLevel
    ? LEVEL_STYLES[sponsor.sponsorshipLevel]
    : null;
  const partnerYear = new Date(sponsor.partnershipSince).getFullYear();

  return (
    <div className="group relative h-full">
      {/* Glow on hover */}
      <div
        className={cn(
          'absolute -inset-1 rounded-3xl opacity-0 blur-lg transition-all duration-700 group-hover:opacity-100',
          isPartner
            ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15'
            : 'bg-gradient-to-r from-amber-500/15 to-orange-500/15',
        )}
      />

      <Card className="relative rounded-3xl border-0 bg-white shadow-xl shadow-stone-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden h-full">
        {/* Top accent */}
        <div
          className={cn(
            'h-1.5 bg-gradient-to-r',
            isPartner
              ? 'from-emerald-500 via-teal-500 to-emerald-600'
              : 'from-amber-400 via-orange-400 to-amber-500',
          )}
        />

        {/* Featured ribbon */}
        <div className="absolute top-6 right-6">
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'bg-amber-50 border border-amber-200/60',
              'text-amber-700',
            )}
          >
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em]">
              Featured
            </span>
          </div>
        </div>

        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  'absolute -inset-3 rounded-2xl opacity-20 blur-md',
                  isPartner
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600',
                )}
              />
              <div className="relative">
                <SponsorLogo sponsor={sponsor} size="lg" />
                {levelStyle && (
                  <div className="absolute -bottom-2 -right-2 text-lg">
                    {levelStyle.icon}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-heading font-bold text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors duration-300">
                {sponsor.organizationName}
              </h3>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge
                  className={cn(
                    'rounded-lg text-[10px] px-2.5 py-0.5 font-bold border',
                    isPartner
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-amber-50 text-amber-700 border-amber-200/60',
                  )}
                >
                  {isPartner ? (
                    <Handshake className="h-3 w-3 mr-1" />
                  ) : (
                    <Heart className="h-3 w-3 mr-1" />
                  )}
                  {isPartner ? 'Partner' : 'Sponsor'}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-lg text-[10px] px-2 py-0.5 border-stone-200 text-stone-500"
                >
                  {CATEGORY_LABELS[sponsor.category] || sponsor.category}
                </Badge>
                {sponsor.sponsorshipLevel && (
                  <Badge className="rounded-lg text-[10px] px-2 py-0.5 font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                    {sponsor.sponsorshipLevel}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-[10px] text-stone-400">
                  <CalendarDays className="h-3 w-3" />
                  Since {partnerYear}
                </span>
              </div>

              {(sponsor.description || sponsor.shortDescription) && (
                <p className="text-sm text-stone-500 mt-4 leading-relaxed line-clamp-3 font-light">
                  {sponsor.shortDescription || sponsor.description}
                </p>
              )}

              {sponsor.areasOfSupport?.length > 0 && (
                <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                  {sponsor.areasOfSupport.map((area) => (
                    <span
                      key={area}
                      className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-stone-100 text-stone-600 border border-stone-200/60"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}

              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 mt-5 text-xs font-semibold',
                    isPartner
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-amber-600 hover:text-amber-700',
                    'transition-colors duration-200',
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Visit website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REGULAR SPONSOR CARD (Light Theme – For About Page)
   ═══════════════════════════════════════════════════════════ */

function SponsorCardLight({ sponsor }: { sponsor: Sponsor }) {
  const isPartner = sponsor.type === 'PARTNER';
  const levelStyle = sponsor.sponsorshipLevel
    ? LEVEL_STYLES[sponsor.sponsorshipLevel]
    : null;
  const partnerYear = new Date(sponsor.partnershipSince).getFullYear();

  return (
    <Card className="group relative rounded-2xl border-0 bg-white shadow-md shadow-stone-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden h-full">
      {/* Top accent line */}
      <div
        className={cn(
          'h-0.5 bg-gradient-to-r origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700',
          isPartner
            ? 'from-emerald-500 to-teal-500'
            : 'from-amber-400 to-orange-400',
        )}
      />

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="relative shrink-0">
            <SponsorLogo sponsor={sponsor} size="md" />
            {levelStyle && (
              <div className="absolute -bottom-1.5 -right-1.5 text-sm">
                {levelStyle.icon}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-bold text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors duration-300 line-clamp-1">
              {sponsor.organizationName}
            </h4>

            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <Badge
                className={cn(
                  'rounded-md text-[9px] px-1.5 py-0 h-4 font-bold border',
                  isPartner
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                    : 'bg-amber-50 text-amber-700 border-amber-200/50',
                )}
              >
                {isPartner ? 'Partner' : 'Sponsor'}
              </Badge>
              <span className="text-[10px] text-stone-400">
                {CATEGORY_LABELS[sponsor.category] || sponsor.category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {(sponsor.description || sponsor.shortDescription) && (
          <p className="text-xs text-stone-500 mt-4 leading-relaxed line-clamp-2 font-light">
            {sponsor.shortDescription || sponsor.description}
          </p>
        )}

        {/* Areas of Support */}
        {sponsor.areasOfSupport?.length > 0 && (
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            {sponsor.areasOfSupport.slice(0, 3).map((area) => (
              <span
                key={area}
                className="text-[9px] px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-stone-200/50 font-medium"
              >
                {area}
              </span>
            ))}
            {sponsor.areasOfSupport.length > 3 && (
              <span className="text-[9px] text-stone-400 font-medium">
                +{sponsor.areasOfSupport.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <span className="flex items-center gap-1 text-[10px] text-stone-400">
            <CalendarDays className="h-3 w-3" />
            Since {partnerYear}
          </span>

          <div className="flex items-center gap-2">
            {sponsor.sponsorshipLevel && (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                {sponsor.sponsorshipLevel}
              </span>
            )}
            {sponsor.website && (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}