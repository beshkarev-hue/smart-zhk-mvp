import apiClient from './axios';

export const usersService = {
  async getExecutors() {
    const response = await apiClient.get('/users/executors');
    return response.data;
  },
};
