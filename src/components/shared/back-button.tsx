'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Props {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = 'Back' }: Props) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-lg gap-2 mb-4 -ml-2"
      onClick={() => (href ? router.push(href) : router.back())}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}