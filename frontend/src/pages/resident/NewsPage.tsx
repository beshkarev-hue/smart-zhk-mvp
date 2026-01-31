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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleNewsClick = async (newsId: string) => {
    if (!readNewsIds.includes(newsId)) {
      try {
        await userNewsReadService.markAsRead(newsId);
        setReadNewsIds([...readNewsIds, newsId]);
      } catch (error) {
        console.error('Ошибка отметки прочитанным:', error);
      }
    }
  };

  const handleCheckboxChange = (newsId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (selectedIds.includes(newsId)) {
      setSelectedIds(selectedIds.filter(id => id !== newsId));
    } else {
      setSelectedIds([...selectedIds, newsId]);
    }
  };

  const handleSelectAll = () => {
    const filtered = getFilteredNews();
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(n => n.id));
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Удаляем выбранные новости
      await Promise.all(selectedIds.map(id => newsService.remove(id)));
      
      // Обновляем список
      setNews(news.filter(n => !selectedIds.includes(n.id)));
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Ошибка удаления новостей:', error);
      alert('Ошибка при удалении новостей');
    }
  };

  const getFilteredNews = () => {
    let filtered = news;
    if (filter !== 'all') {
      filtered = news.filter(n => n.category === filter);
    }
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  };

  const filteredNews = getFilteredNews();
  const unreadCount = news.filter(n => !readNewsIds.includes(n.id)).length;

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>← Назад</button>
        <h1 className={styles.title}>Новости</h1>
      </div>

      <div className={styles.filters}>
        <button 
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'normal' ? styles.active : ''}`}
          onClick={() => setFilter('normal')}
        >
          📅 Объявления
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'planned' ? styles.active : ''}`}
          onClick={() => setFilter('planned')}
        >
          ⚠️ Плановые работы
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'urgent' ? styles.active : ''}`}
          onClick={() => setFilter('urgent')}
        >
          🚨 Срочное
        </button>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.selectAllCheckbox}>
          <input
            type="checkbox"
            checked={selectedIds.length === filteredNews.length && filteredNews.length > 0}
            onChange={handleSelectAll}
          />
          <span>Выбрать все</span>
        </label>

        {selectedIds.length > 0 && (
          <button onClick={handleDeleteSelected} className={styles.deleteButton}>
            🗑️ Удалить выбранные ({selectedIds.length})
          </button>
        )}
      </div>

      <div className={styles.newsList}>
        {filteredNews.map(item => {
          const isRead = readNewsIds.includes(item.id);
          const isSelected = selectedIds.includes(item.id);
          
          return (
            <div 
              key={item.id} 
              className={`${styles.newsCard} ${isRead ? styles.read : styles.unread} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleNewsClick(item.id)}
            >
              <div className={styles.checkboxWrapper} onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(item.id, e)}
                  className={styles.checkbox}
                />
              </div>

              {!isRead && <div className={styles.unreadBadge}>●</div>}
              {item.isPinned && <div className={styles.pinnedBadge}>📌</div>}
              
              <div className={styles.categoryBadge} data-category={item.category}>
                {item.category === 'normal' && '📅 Объявление'}
                {item.category === 'planned' && '⚠️ Плановые работы'}
                {item.category === 'urgent' && '🚨 Срочное'}
              </div>
              
              <h3 className={styles.newsTitle}>{item.title}</h3>
              <p className={styles.newsContent}>{item.content}</p>
              <div className={styles.newsDate}>
                {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          );
        })}
      </div>

      {showDeleteModal && (
        <div className={styles.modal} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Удалить новости?</h2>
            <p>Вы уверены, что хотите удалить {selectedIds.length} новостей?</p>
            <p className={styles.warning}>Это действие нельзя отменить.</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>
                Отмена
              </button>
              <button onClick={confirmDelete} className={styles.confirmButton}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
