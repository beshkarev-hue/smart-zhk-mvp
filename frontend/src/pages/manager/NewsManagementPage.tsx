import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewsManagementPage.module.css';

interface News {
  id: string;
  category: 'normal' | 'planned' | 'urgent';
  title: string;
  content: string;
  isPublished: boolean;
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  createdAt: string;
}

const NewsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      // Для менеджера загружаем все новости (не только published)
      const response = await fetch('http://localhost:3000/news/all');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить новость?')) return;
    
    try {
      // TODO: добавить метод удаления в newsService
      await fetch(`http://localhost:3000/news/${id}`, { method: 'DELETE' });
      setNews(news.filter(n => n.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления новости');
    }
  };

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
        <h1>Управление новостями</h1>
        <button 
          onClick={() => navigate('/manager/news/create')} 
          className={styles.createButton}
        >
          + Создать новость
        </button>
      </div>

      <div className={styles.newsList}>
        {news.length === 0 ? (
          <p>Новостей пока нет</p>
        ) : (
          news.map((item) => (
            <div key={item.id} className={styles.newsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.category}>
                  {getCategoryLabel(item.category)}
                </div>
                <div className={styles.status}>
                  {item.isPublished ? (
                    <span className={styles.published}>✓ Опубликовано</span>
                  ) : (
                    <span className={styles.draft}>Черновик</span>
                  )}
                  {item.isPinned && <span className={styles.pinned}>📌 Закреплено</span>}
                </div>
              </div>
              
              <h3>{item.title}</h3>
              <p className={styles.content}>{item.content.substring(0, 150)}...</p>
              
              <div className={styles.meta}>
                <span>Создано: {new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                {item.publishedAt && (
                  <span>Опубликовано: {new Date(item.publishedAt).toLocaleDateString('ru-RU')}</span>
                )}
              </div>

              <div className={styles.actions}>
                <button 
                  onClick={() => navigate(`/manager/news/edit/${item.id}`)}
                  className={styles.editButton}
                >
                  ✏️ Редактировать
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className={styles.deleteButton}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsManagementPage;
