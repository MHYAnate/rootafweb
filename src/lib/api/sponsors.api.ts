import { apiClient } from './client';

export const sponsorsApi = {
  getAll: (params?: any) =>
    apiClient.get('/sponsors', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/sponsors/${id}`).then((r) => r.data),
};