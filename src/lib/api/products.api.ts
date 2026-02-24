import { apiClient } from './client';

export const productsApi = {
  getAll: (params?: any) =>
    apiClient.get('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/products/${id}`).then((r) => r.data),

  getMyProducts: (params?: any) =>
    apiClient.get('/products/me/list', { params }).then((r) => r.data),

  create: (data: any) =>
    apiClient.post('/products', data).then((r) => r.data),

  update: (id: string, data: any) =>
    apiClient.put(`/products/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),

  addImage: (id: string, data: any) =>
    apiClient.post(`/products/${id}/images`, data).then((r) => r.data),

  removeImage: (productId: string, imageId: string) =>
    apiClient
      .delete(`/products/${productId}/images/${imageId}`)
      .then((r) => r.data),
};