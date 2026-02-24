import { apiClient } from './client';

export const savedApi = {
  getMySaved: (params?: any) =>
    apiClient.get('/saved', { params }).then((r) => r.data),

  saveItem: (data: { itemType: string; itemId: string }) =>
    apiClient.post('/saved', data).then((r) => r.data),

  removeItem: (id: string) =>
    apiClient.delete(`/saved/${id}`).then((r) => r.data),

  checkSaved: (itemType: string, itemId: string) =>
    apiClient
      .get('/saved/check', { params: { itemType, itemId } })
      .then((r) => r.data),
};