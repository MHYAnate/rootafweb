// import { apiClient } from './client';

// export const aboutApi = {
//   getAll: () =>
//     apiClient.get('/about').then((r) => r.data),

//   getContent: (key: string) =>
//     apiClient.get(`/about/content/${key}`).then((r) => r.data),

//   getLeadership: () =>
//     apiClient.get('/about/leadership').then((r) => r.data),

//   getObjectives: () =>
//     apiClient.get('/about/objectives').then((r) => r.data),

//   getDocuments: () =>
//     apiClient.get('/about/documents').then((r) => r.data),

//   getSponsors: () =>
//     apiClient.get('/sponsors').then((r) => r.data),

//   getTestimonials: () =>
//     apiClient.get('/testimonials').then((r) => r.data),
// };
import { apiClient } from './client';

export const aboutApi = {
  // Main endpoint - returns { content, leadership, objectives, documents, contact, social }
  getAll: () =>
    apiClient.get('/about').then((r) => r.data),

  // Individual section endpoints (if backend supports them)
  getContent: (key: string) =>
    apiClient.get(`/about/content/${key}`).then((r) => r.data),

  // These pull from the same /about endpoint but we extract parts
  getLeadership: () =>
    apiClient.get('/about').then((r) => ({
      data: r.data?.data?.leadership || [],
    })),

  getObjectives: () =>
    apiClient.get('/about').then((r) => ({
      data: r.data?.data?.objectives || [],
    })),

  getDocuments: () =>
    apiClient.get('/about').then((r) => ({
      data: r.data?.data?.documents || [],
    })),

  getContact: () =>
    apiClient.get('/about').then((r) => ({
      data: r.data?.data?.contact || [],
    })),

  getSocial: () =>
    apiClient.get('/about').then((r) => ({
      data: r.data?.data?.social || [],
    })),
};