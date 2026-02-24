'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { StatusBadge } from '@/components/shared/status-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, debouncedSearch, userType],
    queryFn: () => adminApi.getUsers({ page, limit: 20, search: debouncedSearch || undefined, userType: userType || undefined }),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="All Users" />
      <div className="card-premium p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-lg" />
          </div>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="MEMBER">Members</SelectItem>
              <SelectItem value="CLIENT">Clients</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <>
          <div className="space-y-3">
            {data?.data?.map((user: any) => (
              <Card key={user.id} className="card-premium">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{formatPhoneNumber(user.phoneNumber)}</span><span>•</span>
                      <span>{user.userType}</span><span>•</span>
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={user.verificationStatus} />
                    <Link href={`/admin/users/${user.id}`}><Button variant="outline" size="sm" className="rounded-lg gap-1"><Eye className="h-3.5 w-3.5" />View</Button></Link>
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