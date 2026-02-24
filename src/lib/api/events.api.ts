import { apiClient } from './client';

export const eventsApi = {
  getAll: (params?: any) =>
    apiClient.get('/events', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/events/${id}`).then((r) => r.data),
};