import { Metadata } from 'next';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateSeoMetadata({
  title,
  description,
  image,
  noIndex = false,
}: SeoProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}