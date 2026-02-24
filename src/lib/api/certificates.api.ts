import { apiClient } from './client';

export const certificatesApi = {
  getMyCertificates: (params?: any) =>
    apiClient.get('/certificates/me', { params }).then((r) => r.data),

  getByMember: (memberId: string, params?: any) =>
    apiClient
      .get(`/certificates/member/${memberId}`, { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/certificates/${id}`).then((r) => r.data),

  create: (data: any) =>
    apiClient.post('/certificates', data).then((r) => r.data),

  update: (id: string, data: any) =>
    apiClient.put(`/certificates/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/certificates/${id}`).then((r) => r.data),
};