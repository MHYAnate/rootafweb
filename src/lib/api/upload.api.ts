// import { apiClient } from './client';

// export const uploadApi = {
//   uploadImage: (file: File, folder: string = 'general') => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return apiClient
//       .post(`/upload/image?folder=${folder}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       .then((r) => r.data);
//   },

//   uploadImages: (files: File[], folder: string = 'general') => {
//     const formData = new FormData();
//     files.forEach((file) => formData.append('files', file));
//     return apiClient
//       .post(`/upload/images?folder=${folder}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       .then((r) => r.data);
//   },
// };
import { apiClient } from './client';
import { adminApiClient } from './client';

export const uploadApi = {
  // ═══════════════════════════════════════════
  // USER UPLOAD (uses user JWT token)
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  // ADMIN UPLOAD (uses admin JWT token)
  // ═══════════════════════════════════════════
  adminUploadImage: (file: File, folder: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    return adminApiClient
      .post(`/upload/admin/image?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  adminUploadImages: (files: File[], folder: string = 'general') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return adminApiClient
      .post(`/upload/admin/images?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};