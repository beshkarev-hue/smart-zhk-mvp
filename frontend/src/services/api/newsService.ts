import apiClient from './axios';
import { News } from '../../types';

export const newsService = {
  async getAll(): Promise<News[]> {
    const response = await apiClient.get<News[]>('/news');
    return response.data;
  },

  async getById(id: string): Promise<News> {
    const response = await apiClient.get<News>(`/news/${id}`);
    return response.data;
  },

  async create(newsData: Partial<News>): Promise<News> {
    const response = await apiClient.post<News>('/news', newsData);
    return response.data;
  },

  async update(id: string, newsData: Partial<News>): Promise<News> {
    const response = await apiClient.patch<News>(`/news/${id}`, newsData);
    return response.data;
  },

  async publish(id: string): Promise<News> {
    const response = await apiClient.patch<News>(`/news/${id}/publish`, {});
    return response.data;
  },

  async unpublish(id: string): Promise<News> {
    const response = await apiClient.patch<News>(`/news/${id}/unpublish`, {});
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/news/${id}`);
  },
};
