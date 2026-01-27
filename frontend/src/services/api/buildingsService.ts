import apiClient from './axios';

export const buildingsService = {
  async getByAddress(address: string) {
    const response = await apiClient.get(`/buildings/by-address?address=${encodeURIComponent(address)}`);
    return response.data;
  },

  async getAll() {
    const response = await apiClient.get('/buildings');
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await apiClient.put(`/buildings/${id}`, data);
    return response.data;
  },
};
