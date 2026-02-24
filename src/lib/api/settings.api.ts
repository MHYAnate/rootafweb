import { apiClient } from './client';

export const settingsApi = {
  getPublic: () =>
    apiClient.get('/settings/public').then((r) => r.data),

  getContactInfo: () =>
    apiClient.get('/contact-info').then((r) => r.data),

  getSocialLinks: () =>
    apiClient.get('/social-media').then((r) => r.data),

  submitContactForm: (data: any) =>
    apiClient.post('/contact', data).then((r) => r.data),

  getFaqs: (params?: any) =>
    apiClient.get('/faqs', { params }).then((r) => r.data),
};