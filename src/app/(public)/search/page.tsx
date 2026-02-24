'use client';

import { useState } from 'react';
import { useSearch } from '@/hooks/use-search';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search as SearchIcon, Users, Package, Wrench, Hammer } from 'lucide-react';
import Link from 'next/link';

const typeIcons: Record<string, any> = { member: Users, product: Package, service: Wrench, tool: Hammer };

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const { data, isLoading } = useSearch(query, type || undefined);

  return (
    <div className="container-custom py-10">
      <PageHeader title="Search" description="Find members, products, services, and tools" />

      <div className="card-premium p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3 relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for anything..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 h-11 rounded-lg text-base" autoFocus />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {query.length < 2 ? (
        <EmptyState icon={SearchIcon} title="Start searching" description="Enter at least 2 characters to search" />
      ) : isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : !data?.data || Object.values(data.data).every((arr: any) => arr.length === 0) ? (
        <EmptyState icon={SearchIcon} title="No results found" description={`No results for "${query}"`} />
      ) : (
        <div className="space-y-8">
          {Object.entries(data.data).map(([key, items]: [string, any]) => {
            if (!items?.length) return null;
            const Icon = typeIcons[key] || Package;
            return (
              <div key={key}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize"><Icon className="h-5 w-5 text-primary" />{key}s ({items.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item: any) => (
                    <Link key={item.id} href={`/${key}s/${item.id}`}>
                      <Card className="card-premium"><CardContent className="p-4"><h4 className="font-semibold">{item.name || item.fullName || item.user?.fullName}</h4><p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description || item.bio || item.tagline || ''}</p></CardContent></Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}