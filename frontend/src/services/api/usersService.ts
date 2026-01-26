import apiClient from './axios';

export const usersService = {
  async getExecutors() {
    const response = await apiClient.get('/users/executors');
    return response.data;
  },

  async updateRating(userId: string, rating: number) {
    const response = await apiClient.post(`/users/${userId}/rating`, { rating });
    return response.data;
  },
};
