// src/lib/api/ratings.api.ts
import { apiClient } from './client';

export type RatingCategory =
  | 'OVERALL_MEMBER'
  | 'PRODUCT_RATING'
  | 'SERVICE_RATING'
  | 'TOOL_LEASE_RATING';

export interface CreateRatingPayload {
  memberId: string;
  ratingCategory: RatingCategory;
  productId?: string;
  serviceId?: string;
  // toolId omitted — not a column on the Rating table.
  // TOOL_LEASE_RATING is distinguished by ratingCategory alone.
  overallRating: number;
  qualityRating?: number;
  communicationRating?: number;
  valueRating?: number;
  timelinessRating?: number;
  reviewTitle?: string;
  reviewText?: string;
}

export interface Rating {
  id: string;
  clientId: string;
  memberId: string;
  ratingCategory: RatingCategory;
  productId?: string;
  serviceId?: string;
  overallRating: number;
  qualityRating?: number;
  communicationRating?: number;
  valueRating?: number;
  timelinessRating?: number;
  reviewTitle?: string;
  reviewText?: string;
  status: 'ACTIVE' | 'HIDDEN' | 'REMOVED';
  createdAt: string;
  client?:  { user: { fullName: string } };
  member?:  { user: { fullName: string } };
  product?: { name: string };
  service?: { name: string };
}

export interface RatingsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ratingsApi = {
  create: (
    payload: CreateRatingPayload,
  ): Promise<{ message: string; data: Rating }> =>
    apiClient.post('/ratings', payload).then((r) => r.data),

  getByMember: (
    memberId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{ data: Rating[]; meta: RatingsMeta }> =>
    apiClient.get(`/ratings/member/${memberId}`, { params }).then((r) => r.data),

  getMyGiven: (): Promise<{ data: Rating[] }> =>
    apiClient.get('/ratings/me/given').then((r) => r.data),

  getMyReceived: (
    params?: { page?: number },
  ): Promise<{ data: Rating[]; meta: RatingsMeta }> =>
    apiClient.get('/ratings/me/received', { params }).then((r) => r.data),
};