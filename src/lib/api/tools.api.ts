import { apiClient } from './client';

export const toolsApi = {
  getAll: (params?: any) =>
    apiClient.get('/tools', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/tools/${id}`).then((r) => r.data),

  getMyTools: (params?: any) =>
    apiClient.get('/tools/me/list', { params }).then((r) => r.data),

  create: (data: any) =>
    apiClient.post('/tools', data).then((r) => r.data),

  update: (id: string, data: any) =>
    apiClient.put(`/tools/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/tools/${id}`).then((r) => r.data),

  addImage: (id: string, data: any) =>
    apiClient.post(`/tools/${id}/images`, data).then((r) => r.data),
};