'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => settingsApi.getFaqs({ isVisible: true }),
  });

  const faqs = data?.data || [];

  return (
    <div className="container-narrow py-10">
      <PageHeader title="Frequently Asked Questions" description="Find answers to common questions" />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <Card className="card-premium">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq: any, idx: number) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-xl px-4">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
                    <span className="flex items-center gap-2 text-left">
                      <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 pl-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}