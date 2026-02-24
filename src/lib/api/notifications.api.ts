import { apiClient } from './client';

export const notificationsApi = {
  getAll: (params?: any) =>
    apiClient.get('/notifications', { params }).then((r) => r.data),

  getUnreadCount: () =>
    apiClient.get('/notifications/unread-count').then((r) => r.data),

  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all').then((r) => r.data),
};