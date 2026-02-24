'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTools } from '@/hooks/use-tools';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Hammer, MapPin } from 'lucide-react';
import { TOOL_CONDITION_MAP, TOOL_PURPOSE_MAP } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';

export default function ToolsPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [purpose, setPurpose] = useState('');
  const [condition, setCondition] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useTools({
    page, limit: 12, search: debouncedSearch || undefined,
    listingPurpose: purpose || undefined, condition: condition || undefined,
  });

  return (
    <div className="container-custom py-10">
      <PageHeader title="Tool Marketplace" description="Find tools for sale or lease from our members" />

      <div className="card-premium p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-lg" />
          </div>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="All Purposes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Purposes</SelectItem>
              <SelectItem value="FOR_SALE">For Sale</SelectItem>
              <SelectItem value="FOR_LEASE">For Lease</SelectItem>
              <SelectItem value="BOTH">Both</SelectItem>
            </SelectContent>
          </Select>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="Any Condition" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Condition</SelectItem>
              {Object.entries(TOOL_CONDITION_MAP).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-24" />
      ) : data?.data?.length === 0 ? (
        <EmptyState icon={Hammer} title="No tools found" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((tool: any, idx: number) => {
              const condInfo = TOOL_CONDITION_MAP[tool.condition];
              return (
                <Link key={tool.id} href={`/tools/${tool.id}`}>
                  <Card className="card-premium h-full overflow-hidden animate-fade-up" style={{ animationDelay: `${(idx % 4) * 0.05}s` }}>
                    <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                      {tool.images?.[0]?.thumbnailUrl ? (
                        <img src={tool.images[0].thumbnailUrl} alt={tool.name} className="w-full h-full object-cover" />
                      ) : (
                        <Hammer className="h-12 w-12 text-muted-foreground/20" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${condInfo?.color || ''}`}>{condInfo?.label}</span>
                        <span className="text-[10px] text-muted-foreground">{TOOL_PURPOSE_MAP[tool.listingPurpose]}</span>
                      </div>
                      <h3 className="font-semibold line-clamp-1">{tool.name}</h3>
                      <div className="mt-2 space-y-1">
                        {tool.salePrice && <p className="text-sm font-bold text-primary">{formatCurrency(Number(tool.salePrice))}</p>}
                        {tool.leaseRate && <p className="text-xs text-muted-foreground">{formatCurrency(Number(tool.leaseRate))}/{tool.leaseRatePeriod?.replace('PER_', '').toLowerCase()}</p>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><MapPin className="h-3 w-3" />{tool.member?.user?.fullName}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}