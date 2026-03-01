'use client';

import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import { sponsorsApi } from '@/lib/api/sponsors.api';
import { testimonialsApi } from '@/lib/api/testimonials.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  MapPin,
  Quote,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function AboutPage() {
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: aboutApi.getAll,
  });

  const { data: sponsorsData } = useQuery({
    queryKey: ['sponsors'],
    queryFn: () => sponsorsApi.getAll({ isActive: true }),
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsApi.getApproved({ limit: 6 }),
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading..." className="py-24" />;
  }

  const about = aboutData?.data || {};
  const sections = about.sections || [];
  const leadership = about.leadership || [];
  const objectives = about.objectives || [];
  const documents = about.documents || [];
  const sponsors = sponsorsData?.data || [];
  const testimonials = testimonialsData?.data || [];

  const getSectionContent = (key: string) =>
    sections.find((s: any) => s.sectionKey === key);

  const mission = getSectionContent('MISSION_STATEMENT');
  const vision = getSectionContent('VISION_STATEMENT');
  const overview = getSectionContent('OVERVIEW');

  return (
    <div className="container-custom py-10">
      <PageHeader
        title="About RootAF"
        description="Uplifting the Root Artisan Farmers Development Foundation"
      />

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Card className="card-gold">
          <CardContent className="p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              {mission?.content || 'Empowering artisan farmers across Nigeria through skills development, market access, and community support.'}
            </p>
          </CardContent>
        </Card>
        <Card className="card-gold">
          <CardContent className="p-8">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Eye className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              {vision?.content || 'A Nigeria where every artisan farmer has access to the tools, skills, and markets needed to thrive.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overview */}
      {overview && (
        <section className="mb-16">
          <h2 className="section-title mb-4">Who We Are</h2>
          <div className="prose prose-green max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {overview.content}
            </p>
          </div>
        </section>
      )}

      {/* Objectives */}
      {objectives.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Objectives</h2>
            <p className="section-description">Aims and goals of the foundation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj: any, idx: number) => (
              <Card key={obj.id} className="card-premium animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="p-6">
                  <span className="text-2xl font-bold text-primary/20">
                    {String(obj.objectiveNumber).padStart(2, '0')}
                  </span>
                  <h4 className="font-semibold mt-2">{obj.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2">{obj.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Leadership */}
      {leadership.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Leadership</h2>
            <p className="section-description">Board of Trustees and Executive Members</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leadership.map((leader: any, idx: number) => (
              <Card key={leader.id} className="card-gold animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="p-6 text-center">
                  <PremiumAvatar
                    src={leader.photoUrl}
                    name={leader.fullName}
                    size="lg"
                    className="mx-auto"
                  />
                  <h4 className="font-semibold mt-4">{leader.title ? `${leader.title} ` : ''}{leader.fullName}</h4>
                  <p className="text-sm text-primary font-medium mt-1">{leader.position}</p>
                  {leader.shortBio && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{leader.shortBio}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Partners & Sponsors</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsors.map((sponsor: any) => (
              <Card key={sponsor.id} className="card-premium">
                <CardContent className="p-6 text-center">
                  {sponsor.logoUrl ? (
                    <img src={sponsor.logoUrl} alt={sponsor.organizationName} className="h-16 mx-auto object-contain" />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <h4 className="font-semibold mt-3 text-sm">{sponsor.organizationName}</h4>
                  <p className="text-xs text-muted-foreground mt-1 badge-gold inline-block px-2 py-0.5 rounded-full">
                    {sponsor.type}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((test: any) => (
              <Card key={test.id} className="card-premium">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/10 mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{test.testimonialText}"
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                    <PremiumAvatar src={test.photoUrl} name={test.personName} size="sm" />
                    <div>
                      <p className="text-sm font-semibold">{test.personName}</p>
                      <p className="text-xs text-muted-foreground">{test.titleRole}</p>
                    </div>
                  </div>
                  {test.rating && <RatingStars rating={test.rating} size="sm" className="mt-3" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <section>
          <div className="text-center mb-10">
            <h2 className="section-title">Foundation Documents</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc: any) => (
              <Card key={doc.id} className="card-premium">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{doc.documentName}</p>
                    <p className="text-xs text-muted-foreground">{doc.documentType?.replace(/_/g, ' ')}</p>
                  </div>
                  {(doc.photoUrl || doc.externalLink) && (
                    <a
                      href={doc.photoUrl || doc.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}