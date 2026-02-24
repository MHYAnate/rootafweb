import { apiClient } from './client';

export const aboutApi = {
  getAll: () => apiClient.get('/about').then((r) => r.data),
};