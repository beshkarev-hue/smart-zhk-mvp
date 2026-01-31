import api from './axios';

export interface News {
  id: string;
  category: 'normal' | 'planned' | 'urgent';
  title: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  createdAt: string;
}

const newsService = {
  async getPublished(): Promise<News[]> {
    const response = await api.get('/news/published');
    return response.data;
  },

  async getByCategory(category: string): Promise<News[]> {
    const response = await api.get(`/news/category/${category}`);
    return response.data;
  },

  async getById(id: string): Promise<News> {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/news/${id}`);
  },
};

export default newsService;
