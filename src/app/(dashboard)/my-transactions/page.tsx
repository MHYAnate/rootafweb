'use client';

import { useMyTransactions } from '@/hooks/use-transactions';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MyTransactionsPage() {
  const { page, setPage } = usePagination();
  const { data, isLoading } = useMyTransactions({ page, limit: 20 });

  return (
    <div className="space-y-6">
      <PageHeader title="My Transactions" action={<Link href="/my-transactions/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Record Transaction</Button></Link>} />
      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : data?.data?.length === 0 ? (
        <EmptyState icon={DollarSign} title="No transactions recorded" action={<Link href="/my-transactions/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Record Transaction</Button></Link>} />
      ) : (
        <>
          <div className="space-y-3">
            {data?.data?.map((tx: any) => (
              <Card key={tx.id} className="card-premium">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{tx.listingName || tx.transactionType.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-muted-foreground">{tx.clientName && `Client: ${tx.clientName} • `}{formatDate(tx.transactionDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatCurrency(Number(tx.amount))}</p>
                    <Badge variant="outline" className="rounded-lg text-[10px]">{tx.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}