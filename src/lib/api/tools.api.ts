import { apiClient } from './client';

// Response shape helpers
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleResponse<T> {
  id: any;
  data: T;
}

export const toolsApi = {
  // Returns { data: Tool[], meta: {...} }
  getAll: (params?: any): Promise<PaginatedResponse<any>> =>
    apiClient.get('/tools', { params }).then((r) => r.data),

  // Returns { data: Tool }
  getById: (id: string): Promise<SingleResponse<any>> =>
    apiClient.get(`/tools/${id}`).then((r) => r.data),

  // Returns { data: Tool[], meta: {...} }
  getMyTools: (params?: any): Promise<PaginatedResponse<any>> =>
    apiClient.get('/tools/me/list', { params }).then((r) => r.data),

  // Returns { data: Tool }
  create: (data: any): Promise<SingleResponse<any>> =>
    apiClient.post('/tools', data).then((r) => r.data),

  // Returns { data: Tool }
  update: (id: string, data: any): Promise<SingleResponse<any>> =>
    apiClient.put(`/tools/${id}`, data).then((r) => r.data),

  // Returns { message: string }
  delete: (id: string): Promise<any> =>
    apiClient.delete(`/tools/${id}`).then((r) => r.data),

  // Returns { data: ToolImage }
  addImage: (id: string, data: any): Promise<SingleResponse<any>> =>
    apiClient.post(`/tools/${id}/images`, data).then((r) => r.data),

  // Returns { message: string }
  removeImage: (toolId: string, imageId: string): Promise<any> =>
    apiClient
      .delete(`/tools/${toolId}/images/${imageId}`)
      .then((r) => r.data),
};