import { apiClient } from './client';

export const categoriesApi = {
  getAll: (type?: string) =>
    apiClient.get('/categories', { params: { type } }).then((r) => r.data),

  getByType: (type: string) =>
    apiClient.get(`/categories/type/${type}`).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/categories/${id}`).then((r) => r.data),
};