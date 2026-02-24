import { apiClient } from './client';

export const authApi = {
  registerMember: (data: any) =>
    apiClient.post('/auth/register/member', data).then((r) => r.data),

  registerClient: (data: any) =>
    apiClient.post('/auth/register/client', data).then((r) => r.data),

  login: (data: { phoneNumber: string; password: string }) =>
    apiClient.post('/auth/login', data).then((r) => r.data),

  getProfile: () =>
    apiClient.get('/auth/profile').then((r) => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/auth/change-password', data).then((r) => r.data),

  requestPasswordReset: (data: { phoneNumber: string; reason?: string }) =>
    apiClient.post('/auth/request-password-reset', data).then((r) => r.data),
};