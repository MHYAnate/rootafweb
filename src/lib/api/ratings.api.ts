import { apiClient } from './client';

export const ratingsApi = {
  getByMember: (memberId: string, params?: any) =>
    apiClient
      .get(`/ratings/member/${memberId}`, { params })
      .then((r) => r.data),

  create: (data: any) =>
    apiClient.post('/ratings', data).then((r) => r.data),

  getMyGiven: () =>
    apiClient.get('/ratings/me/given').then((r) => r.data),

  getMyReceived: (params?: any) =>
    apiClient.get('/ratings/me/received', { params }).then((r) => r.data),
};