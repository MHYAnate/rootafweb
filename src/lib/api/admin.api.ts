// import { adminApiClient } from './client';

// export const adminApi = {
//   // ─── Auth ───
//   login: (data: { username: string; password: string }) =>
//     adminApiClient.post('/admin/auth/login', data).then((r) => r.data),
//   getProfile: () =>
//     adminApiClient.get('/admin/auth/profile').then((r) => r.data),
//   changePassword: (data: any) =>
//     adminApiClient.post('/admin/auth/change-password', data).then((r) => r.data),
//   createAdmin: (data: any) =>
//     adminApiClient.post('/admin/auth/create', data).then((r) => r.data),
//   getAllAdmins: () =>
//     adminApiClient.get('/admin/auth/all').then((r) => r.data),
//   toggleAdminStatus: (id: string) =>
//     adminApiClient.patch(`/admin/auth/${id}/toggle-status`).then((r) => r.data),

//   // ─── Dashboard ───
//   getDashboard: () =>
//     adminApiClient.get('/admin/dashboard').then((r) => r.data),
//   getActivityLog: (params?: any) =>
//     adminApiClient
//       .get('/admin/dashboard/activity-log', { params })
//       .then((r) => r.data),

//   // ─── Verification ───
//   getPendingVerifications: (params?: any) =>
//     adminApiClient
//       .get('/admin/verification/pending', { params })
//       .then((r) => r.data),
//   getVerificationDetail: (userId: string) =>
//     adminApiClient
//       .get(`/admin/verification/user/${userId}`)
//       .then((r) => r.data),
//   startReview: (userId: string) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/start-review`)
//       .then((r) => r.data),
//   approveUser: (userId: string, notes?: string) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/approve`, { notes })
//       .then((r) => r.data),
//   rejectUser: (
//     userId: string,
//     data: { reason: string; details: string },
//   ) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/reject`, data)
//       .then((r) => r.data),
//   requestResubmission: (
//     userId: string,
//     data: { reason: string; documentIds?: string[] },
//   ) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/request-resubmission`, data)
//       .then((r) => r.data),
//   suspendUser: (userId: string, reason: string) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/suspend`, { reason })
//       .then((r) => r.data),
//   reactivateUser: (userId: string) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/reactivate`)
//       .then((r) => r.data),
//   resetUserPassword: (userId: string, newPassword: string) =>
//     adminApiClient
//       .post(`/admin/verification/user/${userId}/reset-password`, {
//         newPassword,
//       })
//       .then((r) => r.data),
//   getVerificationStats: () =>
//     adminApiClient.get('/admin/verification/stats').then((r) => r.data),

//   // ─── Password Resets ───
//   getPendingResets: (params?: any) =>
//     adminApiClient
//       .get('/admin/verification/password-resets', { params })
//       .then((r) => r.data),
//   processReset: (
//     id: string,
//     data: { temporaryPassword: string; notes?: string },
//   ) =>
//     adminApiClient
//       .post(`/admin/verification/password-resets/${id}/process`, data)
//       .then((r) => r.data),

//   // ─── Users ───
//   getUsers: (params?: any) =>
//     adminApiClient.get('/admin/users', { params }).then((r) => r.data),
//   getUserById: (id: string) =>
//     adminApiClient.get(`/admin/users/${id}`).then((r) => r.data),

//   // ─── Listings ───
//   toggleListingFeatured: (type: string, id: string) =>
//     adminApiClient
//       .patch(`/admin/dashboard/listings/${type}/${id}/feature`)
//       .then((r) => r.data),
//   deactivateListing: (type: string, id: string, reason: string) =>
//     adminApiClient
//       .post(`/admin/dashboard/listings/${type}/${id}/deactivate`, { reason })
//       .then((r) => r.data),
//   toggleMemberFeatured: (id: string) =>
//     adminApiClient
//       .patch(`/admin/dashboard/members/${id}/feature`)
//       .then((r) => r.data),

//   // ─── Ratings ───
//   getReportedRatings: (params?: any) =>
//     adminApiClient
//       .get('/admin/dashboard/ratings/reported', { params })
//       .then((r) => r.data),
//   moderateRating: (id: string, data: { action: string; notes?: string }) =>
//     adminApiClient
//       .post(`/admin/dashboard/ratings/${id}/moderate`, data)
//       .then((r) => r.data),

//   // ─── Content ───
//   updateAboutContent: (key: string, data: any) =>
//     adminApiClient.put(`/about/content/${key}`, data).then((r) => r.data),
//   createLeadership: (data: any) =>
//     adminApiClient.post('/about/leadership', data).then((r) => r.data),
//   updateLeadership: (id: string, data: any) =>
//     adminApiClient.put(`/about/leadership/${id}`, data).then((r) => r.data),
//   deleteLeadership: (id: string) =>
//     adminApiClient.delete(`/about/leadership/${id}`).then((r) => r.data),
//   createSponsor: (data: any) =>
//     adminApiClient.post('/sponsors', data).then((r) => r.data),
//   updateSponsor: (id: string, data: any) =>
//     adminApiClient.put(`/sponsors/${id}`, data).then((r) => r.data),
//   deleteSponsor: (id: string) =>
//     adminApiClient.delete(`/sponsors/${id}`).then((r) => r.data),
//   createTestimonial: (data: any) =>
//     adminApiClient.post('/testimonials', data).then((r) => r.data),
//   approveTestimonial: (id: string) =>
//     adminApiClient
//       .patch(`/testimonials/${id}/approve`)
//       .then((r) => r.data),
//   createEvent: (data: any) =>
//     adminApiClient.post('/events', data).then((r) => r.data),
//   updateEvent: (id: string, data: any) =>
//     adminApiClient.put(`/events/${id}`, data).then((r) => r.data),
//   publishEvent: (id: string) =>
//     adminApiClient.patch(`/events/${id}/publish`).then((r) => r.data),

//   // ─── Categories ───
//   createCategory: (data: any) =>
//     adminApiClient.post('/categories', data).then((r) => r.data),
//   updateCategory: (id: string, data: any) =>
//     adminApiClient.put(`/categories/${id}`, data).then((r) => r.data),
//   toggleCategory: (id: string) =>
//     adminApiClient.patch(`/categories/${id}/toggle`).then((r) => r.data),

//   // ─── Announcements ───
//   getAnnouncements: (params?: any) =>
//     adminApiClient
//       .get('/admin/dashboard/announcements', { params })
//       .then((r) => r.data),
//   createAnnouncement: (data: any) =>
//     adminApiClient
//       .post('/admin/dashboard/announcements', data)
//       .then((r) => r.data),

//   // ─── Export ───
//   exportUsers: (params?: any) =>
//     adminApiClient
//       .get('/admin/dashboard/export/users', { params })
//       .then((r) => r.data),
//   exportTransactions: (params?: any) =>
//     adminApiClient
//       .get('/admin/dashboard/export/transactions', { params })
//       .then((r) => r.data),

//   // ─── Settings ───
//   getSettings: () =>
//     adminApiClient.get('/settings').then((r) => r.data),
//   updateSetting: (key: string, value: string) =>
//     adminApiClient.put(`/settings/${key}`, { value }).then((r) => r.data),
// };


// src/lib/api/admin.api.ts
import { adminApiClient } from './client';

export const adminApi = {
  // Auth
  login: (data: { username: string; password: string }) => adminApiClient.post('/admin/auth/login', data).then((r) => r.data),
  getProfile: () => adminApiClient.get('/admin/auth/profile').then((r) => r.data),
  changePassword: (data: any) => adminApiClient.post('/admin/auth/change-password', data).then((r) => r.data),
  createAdmin: (data: any) => adminApiClient.post('/admin/auth/create', data).then((r) => r.data),
  getAllAdmins: () => adminApiClient.get('/admin/auth/all').then((r) => r.data),
  toggleAdminStatus: (id: string) => adminApiClient.patch(`/admin/auth/${id}/toggle-status`).then((r) => r.data),

  // Dashboard
  getDashboard: () => adminApiClient.get('/admin/dashboard').then((r) => r.data),
  getActivityLog: (params?: any) => adminApiClient.get('/admin/dashboard/activity-log', { params }).then((r) => r.data),

  // Verification
  getPendingVerifications: (params?: any) => adminApiClient.get('/admin/verification/pending', { params }).then((r) => r.data),
  getVerificationDetail: (userId: string) => adminApiClient.get(`/admin/verification/user/${userId}`).then((r) => r.data),
  startReview: (userId: string) => adminApiClient.post(`/admin/verification/user/${userId}/start-review`).then((r) => r.data),
  approveUser: (userId: string, notes?: string) => adminApiClient.post(`/admin/verification/user/${userId}/approve`, { notes }).then((r) => r.data),
  rejectUser: (userId: string, data: { reason: string; details: string }) => adminApiClient.post(`/admin/verification/user/${userId}/reject`, data).then((r) => r.data),
  requestResubmission: (userId: string, data: { reason: string; documentIds?: string[] }) => adminApiClient.post(`/admin/verification/user/${userId}/request-resubmission`, data).then((r) => r.data),
  suspendUser: (userId: string, reason: string) => adminApiClient.post(`/admin/verification/user/${userId}/suspend`, { reason }).then((r) => r.data),
  reactivateUser: (userId: string) => adminApiClient.post(`/admin/verification/user/${userId}/reactivate`).then((r) => r.data),
  resetUserPassword: (userId: string, newPassword: string) => adminApiClient.post(`/admin/verification/user/${userId}/reset-password`, { newPassword }).then((r) => r.data),
  getVerificationStats: () => adminApiClient.get('/admin/verification/stats').then((r) => r.data),

  // Password Resets
  getPendingResets: (params?: any) => adminApiClient.get('/admin/verification/password-resets', { params }).then((r) => r.data),
  processReset: (id: string, data: { temporaryPassword: string; notes?: string }) => adminApiClient.post(`/admin/verification/password-resets/${id}/process`, data).then((r) => r.data),

  // Users
  getUsers: (params?: any) => adminApiClient.get('/admin/users', { params }).then((r) => r.data),
  getUserById: (id: string) => adminApiClient.get(`/admin/users/${id}`).then((r) => r.data),

  // Listings
  toggleListingFeatured: (type: string, id: string) => adminApiClient.patch(`/admin/dashboard/listings/${type}/${id}/feature`).then((r) => r.data),
  deactivateListing: (type: string, id: string, reason: string) => adminApiClient.post(`/admin/dashboard/listings/${type}/${id}/deactivate`, { reason }).then((r) => r.data),
  toggleMemberFeatured: (id: string) => adminApiClient.patch(`/admin/dashboard/members/${id}/feature`).then((r) => r.data),

  // Ratings
  getReportedRatings: (params?: any) => adminApiClient.get('/admin/dashboard/ratings/reported', { params }).then((r) => r.data),
  moderateRating: (id: string, data: { action: string; notes?: string }) => adminApiClient.post(`/admin/dashboard/ratings/${id}/moderate`, data).then((r) => r.data),

  // Content Reports
  getContentReports: (params?: any) => adminApiClient.get('/admin/dashboard/reports/content', { params }).then((r) => r.data),
  resolveContentReport: (id: string, data: { resolution: string; notes: string; actionTaken: string }) => adminApiClient.post(`/admin/dashboard/reports/content/${id}/resolve`, data).then((r) => r.data),

  // Content Management
  updateAboutContent: (key: string, data: any) => adminApiClient.put(`/about/content/${key}`, data).then((r) => r.data),
  createLeadership: (data: any) => adminApiClient.post('/about/leadership', data).then((r) => r.data),
  updateLeadership: (id: string, data: any) => adminApiClient.put(`/about/leadership/${id}`, data).then((r) => r.data),
  deleteLeadership: (id: string) => adminApiClient.delete(`/about/leadership/${id}`).then((r) => r.data),
  createSponsor: (data: any) => adminApiClient.post('/sponsors', data).then((r) => r.data),
  updateSponsor: (id: string, data: any) => adminApiClient.put(`/sponsors/${id}`, data).then((r) => r.data),
  deleteSponsor: (id: string) => adminApiClient.delete(`/sponsors/${id}`).then((r) => r.data),
  createTestimonial: (data: any) => adminApiClient.post('/testimonials', data).then((r) => r.data),
  approveTestimonial: (id: string) => adminApiClient.patch(`/testimonials/${id}/approve`).then((r) => r.data),
  createEvent: (data: any) => adminApiClient.post('/events', data).then((r) => r.data),
  updateEvent: (id: string, data: any) => adminApiClient.put(`/events/${id}`, data).then((r) => r.data),
  publishEvent: (id: string) => adminApiClient.patch(`/events/${id}/publish`).then((r) => r.data),

  // Categories
  createCategory: (data: any) => adminApiClient.post('/categories', data).then((r) => r.data),
  updateCategory: (id: string, data: any) => adminApiClient.put(`/categories/${id}`, data).then((r) => r.data),
  toggleCategory: (id: string) => adminApiClient.patch(`/categories/${id}/toggle`).then((r) => r.data),

  // Announcements
  getAnnouncements: (params?: any) => adminApiClient.get('/admin/dashboard/announcements', { params }).then((r) => r.data),
  createAnnouncement: (data: any) => adminApiClient.post('/admin/dashboard/announcements', data).then((r) => r.data),
  updateAnnouncement: (id: string, data: any) => adminApiClient.put(`/admin/dashboard/announcements/${id}`, data).then((r) => r.data),
  deleteAnnouncement: (id: string) => adminApiClient.delete(`/admin/dashboard/announcements/${id}`).then((r) => r.data),

  // FAQs
  getFaqs: () => adminApiClient.get('/admin/dashboard/faqs').then((r) => r.data),
  createFaq: (data: any) => adminApiClient.post('/admin/dashboard/faqs', data).then((r) => r.data),
  updateFaq: (id: string, data: any) => adminApiClient.put(`/admin/dashboard/faqs/${id}`, data).then((r) => r.data),
  deleteFaq: (id: string) => adminApiClient.delete(`/admin/dashboard/faqs/${id}`).then((r) => r.data),

  // Export
  exportUsers: (params?: any) => adminApiClient.get('/admin/dashboard/export/users', { params }).then((r) => r.data),
  exportTransactions: (params?: any) => adminApiClient.get('/admin/dashboard/export/transactions', { params }).then((r) => r.data),

  // Settings
  getSettings: () => adminApiClient.get('/settings').then((r) => r.data),
  updateSetting: (key: string, value: string) => adminApiClient.put(`/settings/${key}`, { value }).then((r) => r.data),
};