import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedMembers } from '@/components/home/featured-members';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CTASection } from '@/components/home/cta-section';
import  SponsorsCarousel  from '@/components/home/sponsors-carousel';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedMembers />
        <FeaturedProducts />
        <SponsorsCarousel  />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}