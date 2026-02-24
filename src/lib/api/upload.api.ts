import { apiClient } from './client';

export const uploadApi = {
  uploadImage: (file: File, folder: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post(`/upload/image?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  uploadImages: (files: File[], folder: string = 'general') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient
      .post(`/upload/images?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};