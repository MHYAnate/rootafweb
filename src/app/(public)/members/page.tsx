// 'use client';

// import { useState } from 'react';
// import { useMembers } from '@/hooks/use-members';
// import { usePagination } from '@/hooks/use-pagination';
// import { useDebounce } from '@/hooks/use-debounce';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { PremiumAvatar } from '@/components/shared/premium-avatar';
// import { RatingStars } from '@/components/shared/rating-stars';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';
// import { PROVIDER_TYPE_MAP, NIGERIAN_STATES } from '@/lib/constants';
// import { Search, Users, MapPin, SlidersHorizontal } from 'lucide-react';
// import Link from 'next/link';

// // Constants for "all" selection values
// const ALL_TYPES = 'all-types';
// const ALL_STATES = 'all-states';

// export default function MembersPage() {
//   const { page, setPage } = usePagination();
//   const [search, setSearch] = useState('');
//   const [providerType, setProviderType] = useState('');
//   const [state, setState] = useState('');
//   const debouncedSearch = useDebounce(search, 500);

//   const { data, isLoading } = useMembers({
//     page,
//     limit: 12,
//     search: debouncedSearch || undefined,
//     providerType: providerType || undefined,
//     state: state || undefined,
//   });

//   // Handler for provider type change
//   const handleProviderTypeChange = (value: string) => {
//     setProviderType(value === ALL_TYPES ? '' : value);
//   };

//   // Handler for state change
//   const handleStateChange = (value: string) => {
//     setState(value === ALL_STATES ? '' : value);
//   };

//   return (
//     <div className="container-custom py-10">
//       <PageHeader
//         title="Our Members"
//         description="Browse verified farmers and artisans across Nigeria"
//         badge={
//           <span className="badge-premium text-[10px]">
//             {data?.meta?.total || 0} Members
//           </span>
//         }
//       />

//       {/* Filters */}
//       <div className="card-premium p-5 mb-8">
//         <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
//           <SlidersHorizontal className="h-4 w-4" />
//           Filter Members
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search members..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10 h-11 rounded-lg"
//             />
//           </div>
          
//           {/* Provider Type Filter */}
//           <Select 
//             value={providerType || ALL_TYPES} 
//             onValueChange={handleProviderTypeChange}
//           >
//             <SelectTrigger className="h-11 rounded-lg">
//               <SelectValue placeholder="All Types" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_TYPES}>All Types</SelectItem>
//               <SelectItem value="FARMER">🌾 Farmers</SelectItem>
//               <SelectItem value="ARTISAN">🔨 Artisans</SelectItem>
//               <SelectItem value="BOTH">🌾🔨 Both</SelectItem>
//             </SelectContent>
//           </Select>
          
//           {/* State Filter */}
//           <Select 
//             value={state || ALL_STATES} 
//             onValueChange={handleStateChange}
//           >
//             <SelectTrigger className="h-11 rounded-lg">
//               <SelectValue placeholder="All States" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_STATES}>All States</SelectItem>
//               {NIGERIAN_STATES.map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {isLoading ? (
//         <LoadingSpinner
//           size="lg"
//           text="Loading members..."
//           className="py-24"
//         />
//       ) : data?.data?.length === 0 ? (
//         <EmptyState
//           icon={Users}
//           title="No members found"
//           description="Try adjusting your search or filters"
//         />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {data?.data?.map((member: any, idx: number) => {
//               const providerInfo = PROVIDER_TYPE_MAP[member.providerType];
//               return (
//                 <Link
//                   key={member.id}
//                   href={`/members/${member.id}`}
//                 >
//                   <Card
//                     className="card-gold h-full animate-fade-up"
//                     style={{
//                       animationDelay: `${(idx % 4) * 0.05}s`,
//                     }}
//                   >
//                     <CardContent className="p-6 text-center">
//                       <PremiumAvatar
//                         src={member.profilePhotoThumbnail}
//                         name={member.user?.fullName || ''}
//                         size="lg"
//                         verified={
//                           member.user?.verificationStatus === 'VERIFIED'
//                         }
//                         className="mx-auto"
//                       />
//                       <h3 className="font-semibold mt-4">
//                         {member.user?.fullName}
//                       </h3>
//                       <span className="text-xs font-medium text-primary mt-1 flex items-center justify-center gap-1">
//                         <span>{providerInfo?.icon}</span>
//                         {providerInfo?.label}
//                       </span>
//                       <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
//                         <MapPin className="h-3 w-3" />
//                         {member.state}
//                       </div>
//                       {member.tagline && (
//                         <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
//                           {member.tagline}
//                         </p>
//                       )}
//                       <div className="mt-4 pt-4 border-t border-border/50 flex justify-center">
//                         <RatingStars
//                           rating={Number(member.averageRating)}
//                           size="sm"
//                           showValue
//                           totalRatings={member.totalRatings}
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               );
//             })}
//           </div>

//           {data?.meta && (
//             <PaginationControls
//               meta={data.meta}
//               onPageChange={setPage}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useMembers } from '@/hooks/use-members';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { RatingStars } from '@/components/shared/rating-stars';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PROVIDER_TYPE_MAP, NIGERIAN_STATES } from '@/lib/constants';
import { Search, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function MembersPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [providerType, setProviderType] = useState('_all');
  const [state, setState] = useState('_all');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useMembers({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    providerType: providerType === '_all' ? undefined : providerType,
    state: state === '_all' ? undefined : state,
  });

  return (
    <div className="container-custom py-8">
      <PageHeader
        title="Our Members"
        description="Browse verified farmers and artisans across Nigeria"
        badge="Community"
      />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>
        <Select value={providerType} onValueChange={setProviderType}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="_all">All Types</SelectItem>
            <SelectItem value="FARMER">🌾 Farmers</SelectItem>
            <SelectItem value="ARTISAN">🔨 Artisans</SelectItem>
            <SelectItem value="BOTH">Both</SelectItem>
          </SelectContent>
        </Select>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="_all">All States</SelectItem>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading members..." className="py-20" />
      ) : !data?.data?.length ? (
        <EmptyState icon={Users} title="No members found" description="Try adjusting your search or filters" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data.map((member: any) => (
              <Link key={member.id} href={`/members/${member.id}`}>
                <Card className="card-hover h-full rounded-2xl border-border/50 overflow-hidden group">
                  <CardContent className="p-6 text-center">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-50 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {member.profilePhotoThumbnail ? (
                        <img src={member.profilePhotoThumbnail} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {member.user?.fullName?.[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold">{member.user?.fullName}</h3>
                    <p className="text-xs text-primary font-medium mt-1">
                      {PROVIDER_TYPE_MAP[member.providerType]?.icon}{' '}
                      {PROVIDER_TYPE_MAP[member.providerType]?.label}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      {member.state}
                    </div>
                    {member.tagline && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.tagline}</p>
                    )}
                    <div className="mt-3 flex justify-center">
                      <RatingStars rating={Number(member.averageRating)} size="sm" showValue totalRatings={member.totalRatings} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}