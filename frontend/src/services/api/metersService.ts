import apiClient from './axios';

export const metersService = {
  async getMyMeters() {
    const response = await apiClient.get('/meters/my');
    return response.data;
  },

  async getByApartment(number: string) {
    const response = await apiClient.get(`/meters/apartment/${number}`);
    return response.data;
  },

  async submitReading(id: string, reading: number | { readingT1: number; readingT2: number; readingT3: number }) {
    const response = await apiClient.post(`/meters/${id}/reading`, { reading });
    return response.data;
  },
};
