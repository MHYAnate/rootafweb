// lib/api/stats.api.ts

import { apiClient } from './client';

export interface PlatformStats {
  members: {
    total: number;
    farmers: number;
    artisans: number;
    both: number;
    newThisMonth: number;
    growthPercentage: number;
    verified: number;
  };
  clients: {
    total: number;
    verified: number;
    newThisMonth: number;
    growthPercentage: number;
  };
  products: {
    total: number;
    active: number;
    agricultural: number;
    artisan: number;
    newThisMonth: number;
    growthPercentage: number;
  };
  services: {
    total: number;
    active: number;
    farming: number;
    artisan: number;
    newThisMonth: number;
    growthPercentage: number;
  };
  tools: {
    total: number;
    active: number;
    forSale: number;
    forLease: number;
    newThisMonth: number;
    growthPercentage: number;
  };
  transactions: {
    totalCount: number;
    totalAmount: number;
    thisMonthCount: number;
    thisMonthAmount: number;
    growthPercentage: number;
  };
  ratings: {
    totalCount: number;
    averageRating: number;
    thisMonthCount: number;
  };
  coverage: {
    statesCount: number;
    lgasCount: number;
    topStates: { name: string; memberCount: number }[];
  };
  engagement: {
    totalProfileViews: number;
    totalProductViews: number;
    totalServiceViews: number;
    totalToolViews: number;
  };
}

export const statsApi = {
  getPublicStats: async (): Promise<PlatformStats> => {
    const { data } = await apiClient.get('/analytics/public-stats');
    // Backend wraps in { data: {...} }
    return data.data;
  },
};