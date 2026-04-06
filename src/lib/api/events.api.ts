import { apiClient, adminApiClient } from './client';

export const eventsApi = {
  // ═══════════════════════════════════════════════════════════
  // PUBLIC
  // ═══════════════════════════════════════════════════════════

  getAll: (params?: any) =>
    apiClient.get('/events', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get(`/events/${id}`).then((r) => r.data),

  getUpcoming: (params?: any) =>
    apiClient.get('/events/upcoming', { params }).then((r) => r.data),

  getPast: (params?: any) =>
    apiClient.get('/events/past', { params }).then((r) => r.data),

  getFeatured: () =>
    apiClient.get('/events/featured').then((r) => r.data),

  // ═══════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════

  adminGetAll: (params?: any) =>
    adminApiClient.get('/events/admin/all', { params }).then((r) => r.data),

  adminGetById: (id: string) =>
    adminApiClient.get(`/events/admin/${id}`).then((r) => r.data),

  adminCreate: (data: any) =>
    adminApiClient.post('/events', data).then((r) => r.data),

  adminUpdate: (id: string, data: any) =>
    adminApiClient.put(`/events/${id}`, data).then((r) => r.data),

  adminPublish: (id: string) =>
    adminApiClient.patch(`/events/${id}/publish`).then((r) => r.data),

  adminUnpublish: (id: string) =>
    adminApiClient.patch(`/events/${id}/unpublish`).then((r) => r.data),

  adminUpdateStatus: (id: string, status: string) =>
    adminApiClient.patch(`/events/${id}/status`, { status }).then((r) => r.data),

  adminDelete: (id: string) =>
    adminApiClient.delete(`/events/${id}`).then((r) => r.data),

  // Gallery
  adminAddGalleryImage: (eventId: string, data: any) =>
    adminApiClient.post(`/events/${eventId}/gallery`, data).then((r) => r.data),

  adminUpdateGalleryImage: (eventId: string, imageId: string, data: any) =>
    adminApiClient
      .put(`/events/${eventId}/gallery/${imageId}`, data)
      .then((r) => r.data),

  adminRemoveGalleryImage: (eventId: string, imageId: string) =>
    adminApiClient
      .delete(`/events/${eventId}/gallery/${imageId}`)
      .then((r) => r.data),

  // Agenda
  adminAddAgendaItem: (eventId: string, data: any) =>
    adminApiClient.post(`/events/${eventId}/agenda`, data).then((r) => r.data),

  adminUpdateAgendaItem: (eventId: string, itemId: string, data: any) =>
    adminApiClient
      .put(`/events/${eventId}/agenda/${itemId}`, data)
      .then((r) => r.data),

  adminRemoveAgendaItem: (eventId: string, itemId: string) =>
    adminApiClient
      .delete(`/events/${eventId}/agenda/${itemId}`)
      .then((r) => r.data),
};