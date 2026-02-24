'use client';

import { useMySaved, useRemoveSaved } from '@/hooks/use-saved';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const { data, isLoading } = useMySaved();
  const { mutate: removeSaved } = useRemoveSaved();

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Items" />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
        <EmptyState icon={Bookmark} title="No saved items" description="Save products, services, or members to view them later" />
      ) : (
        <div className="space-y-3">
          {data?.data?.map((item: any) => (
            <Card key={item.id} className="card-premium">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.itemType}</p>
                  <h4 className="font-semibold text-sm mt-0.5">{item.itemName || item.itemType}</h4>
                </div>
                <div className="flex gap-2">
                  <Link href={`/${item.itemType}s/${item.itemId}`}>
                    <Button variant="outline" size="icon" className="rounded-lg"><ExternalLink className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline" size="icon" className="rounded-lg text-destructive" onClick={() => removeSaved(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}