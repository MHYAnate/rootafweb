import { apiClient } from './client';

export const searchApi = {
  search: (q: string, type?: string, page?: number) =>
    apiClient
      .get('/search', { params: { q, type, page } })
      .then((r) => r.data),
};