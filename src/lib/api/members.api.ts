import { apiClient } from './client';

export const membersApi = {
  getAll: (params?: any) =>
    apiClient.get('/members', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/members/${id}`).then((r) => r.data),

  getMyProfile: () =>
    apiClient.get('/members/me/profile').then((r) => r.data),

  updateProfile: (data: any) =>
    apiClient.put('/members/me/profile', data).then((r) => r.data),

  addSpecialization: (data: any) =>
    apiClient.post('/members/me/specializations', data).then((r) => r.data),

  removeSpecialization: (id: string) =>
    apiClient.delete(`/members/me/specializations/${id}`).then((r) => r.data),
};