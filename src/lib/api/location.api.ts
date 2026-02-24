import { apiClient } from './client';

export const locationApi = {
  getStates: () =>
    apiClient.get('/location/states').then((r) => r.data),

  getLgasByState: (stateId: string) =>
    apiClient.get(`/location/states/${stateId}/lgas`).then((r) => r.data),

  getLgasByName: (state: string) =>
    apiClient.get('/location/lgas', { params: { state } }).then((r) => r.data),
};