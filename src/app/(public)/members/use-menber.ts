// hooks/use-members.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface MembersParams {
  page?: number;
  limit?: number;
  search?: string;
  providerType?: string;
  state?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface MembersResponse {
  data: any[];
  meta: PaginationMeta;
}

export function useMembers(params: MembersParams = {}) {
  const { page = 1, limit = 12, search, providerType, state } = params;

  return useQuery<MembersResponse>({
    queryKey: ['members', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      if (search) searchParams.set('search', search);
      if (providerType) searchParams.set('providerType', providerType);
      if (state) searchParams.set('state', state);

      const response = await apiClient.get(`/members?${searchParams.toString()}`);
      
      // Handle different response structures
      const rawData = response.data;
      
      // If API returns { success, data, ... } structure
      const items = rawData?.data || rawData || [];
      
      // Check if meta exists in response
      let meta: PaginationMeta;
      
      if (rawData?.meta) {
        // API provides meta
        meta = rawData.meta;
      } else if (rawData?.pagination) {
        // Some APIs use 'pagination' instead of 'meta'
        meta = rawData.pagination;
      } else {
        // Generate meta from response data
        // This is a fallback - ideally your API should return meta
        const dataLength = items.length;
        const hasMore = dataLength === limit; // If we got full page, assume there's more
        
        meta = {
          total: hasMore ? (page * limit) + 1 : ((page - 1) * limit) + dataLength,
          page: page,
          limit: limit,
          totalPages: hasMore ? page + 1 : page,
          hasNextPage: hasMore,
          hasPreviousPage: page > 1,
        };
      }

      return {
        data: items,
        meta,
      };
    },
    staleTime: 30000,
  });
}