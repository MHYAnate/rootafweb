import { apiClient } from './client';

export const eventsApi = {
  getAll: (params?: any) =>
    apiClient.get('/events', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/events/${id}`).then((r) => r.data),

  getUpcoming: (params?: any) =>
    apiClient.get('/events', { params: { ...params, status: 'UPCOMING' } }).then((r) => r.data),

  getPast: (params?: any) =>
    apiClient.get('/events', { params: { ...params, status: 'COMPLETED' } }).then((r) => r.data),

  getFeatured: () =>
    apiClient.get('/events', { params: { isFeatured: true } }).then((r) => r.data),

  recordView: (id: string) =>
    apiClient.post(`/events/${id}/view`).then((r) => r.data),
};