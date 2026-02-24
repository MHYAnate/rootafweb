import { apiClient } from './client';

export const servicesApi = {
  getAll: (params?: any) =>
    apiClient.get('/services', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/services/${id}`).then((r) => r.data),

  getMyServices: (params?: any) =>
    apiClient.get('/services/me/list', { params }).then((r) => r.data),

  create: (data: any) =>
    apiClient.post('/services', data).then((r) => r.data),

  update: (id: string, data: any) =>
    apiClient.put(`/services/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/services/${id}`).then((r) => r.data),

  addImage: (id: string, data: any) =>
    apiClient.post(`/services/${id}/images`, data).then((r) => r.data),
};