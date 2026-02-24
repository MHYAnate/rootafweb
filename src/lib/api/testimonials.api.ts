import { apiClient } from './client';

export const testimonialsApi = {
  getAll: (params?: any) =>
    apiClient.get('/testimonials', { params }).then((r) => r.data),

  getApproved: (params?: any) =>
    apiClient.get('/testimonials/approved', { params }).then((r) => r.data),

  submit: (data: any) =>
    apiClient.post('/testimonials', data).then((r) => r.data),
};