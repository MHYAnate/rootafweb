import { apiClient } from './client';

export const transactionsApi = {
  getMyTransactions: (params?: any) =>
    apiClient.get('/transactions/me', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/transactions/${id}`).then((r) => r.data),

  create: (data: any) =>
    apiClient.post('/transactions', data).then((r) => r.data),

  update: (id: string, data: any) =>
    apiClient.put(`/transactions/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/transactions/${id}`).then((r) => r.data),

  getStats: (params?: any) =>
    apiClient.get('/transactions/me/stats', { params }).then((r) => r.data),
};