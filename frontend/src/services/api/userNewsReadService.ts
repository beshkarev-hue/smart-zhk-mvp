import api from './axios';

const userNewsReadService = {
  async markAsRead(newsId: string): Promise<void> {
    await api.post('/user-news-read/mark-read', { newsId });
  },

  async markAllAsRead(newsIds: string[]): Promise<void> {
    await api.post('/user-news-read/mark-all-read', { newsIds });
  },

  async getReadNewsIds(): Promise<string[]> {
    const response = await api.get('/user-news-read/read-ids');
    return response.data;
  },
};

export default userNewsReadService;
