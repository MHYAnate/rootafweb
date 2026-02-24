import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      const store = useAuthStore.getState();
      if (store.refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: store.refreshToken,
          });
          const { accessToken, refreshToken } = res.data.data;
          store.setAuth(store.user!, accessToken, refreshToken);
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(error.config);
          }
        } catch {
          store.logout();
        }
      } else {
        store.logout();
      }
    }
    return Promise.reject(error);
  },
);

// Admin API client
export const adminApiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

adminApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const { useAdminAuthStore } = require('@/store/admin-auth-store');
      const token = useAdminAuthStore.getState().accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

adminApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const { useAdminAuthStore } = require('@/store/admin-auth-store');
      useAdminAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);