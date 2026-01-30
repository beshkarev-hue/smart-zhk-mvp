import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService, userNewsReadService } from '../../services/api';
import styles from './NewsPage.module.css';

interface News {
  id: string;
  category: 'normal' | 'planned' | 'urgent';
  title: string;
  content: string;
  isPinned: boolean;
  publishedAt: string;
}

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [readNewsIds, setReadNewsIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const [newsData, readIds] = await Promise.all([
        newsService.getPublished(),
        userNewsReadService.getReadNewsIds(),
      ]);
      setNews(newsData);
      setReadNewsIds(readIds);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const allNewsIds = news.map(n => n.id);
      await userNewsReadService.markAllAsRead(allNewsIds);
      setReadNewsIds(allNewsIds);
    } catch (error) {
      console.error('Ошибка отметки прочитанным:', error);
    }
  };

  const handleNewsClick = async (newsId: string) => {
    try {
      if (!readNewsIds.includes(newsId)) {
        await userNewsReadService.markAsRead(newsId);
        setReadNewsIds([...readNewsIds, newsId]);
      }
    } catch (error) {
      console.error('Ошибка отметки прочитанным:', error);
    }
  };

  const filteredNews = news.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  const unreadCount = news.filter(n => !readNewsIds.includes(n.id)).length;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'normal': return '📅 Объявления';
      case 'planned': return '⚠️ Работы';
      case 'urgent': return '🚨 Аварии';
      default: return category;
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Назад
        </button>
        <h1>Новости и объявления</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className={styles.markAllButton}>
            ✓ Отметить все прочитанными ({unreadCount})
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <button 
          className={filter === 'all' ? styles.active : ''}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button 
          className={filter === 'normal' ? styles.active : ''}
          onClick={() => setFilter('normal')}
        >
          📅 Объявления
        </button>
        <button 
          className={filter === 'planned' ? styles.active : ''}
          onClick={() => setFilter('planned')}
        >
          ⚠️ Работы
        </button>
        <button 
          className={filter === 'urgent' ? styles.active : ''}
          onClick={() => setFilter('urgent')}
        >
          🚨 Аварии
        </button>
      </div>

      <div className={styles.newsList}>
        {filteredNews.length === 0 ? (
          <p>Нет новостей</p>
        ) : (
          filteredNews.map((item) => {
            const isRead = readNewsIds.includes(item.id);
            return (
              <div 
                key={item.id} 
                className={`${styles.newsCard} ${item.isPinned ? styles.pinned : ''} ${styles[item.category]} ${isRead ? styles.read : styles.unread}`}
                onClick={() => handleNewsClick(item.id)}
              >
                {!isRead && <div className={styles.unreadBadge}>●</div>}
                <div className={styles.category}>
                  {getCategoryLabel(item.category)}
                </div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <div className={styles.date}>
                  {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NewsPage;
