import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/api';
import { News } from '../../types';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsService.getAll();
      setNews(data);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter((item) =>
    filter === 'all' ? true : item.type === filter
  );

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Новости и объявления</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.filters}>
          <button onClick={() => setFilter('all')} style={{...styles.filterButton, ...(filter === 'all' && styles.filterButtonActive)}}>Все</button>
          <button onClick={() => setFilter('announcement')} style={{...styles.filterButton, ...(filter === 'announcement' && styles.filterButtonActive)}}>📢 Объявления</button>
          <button onClick={() => setFilter('news')} style={{...styles.filterButton, ...(filter === 'news' && styles.filterButtonActive)}}>📰 Новости</button>
          <button onClick={() => setFilter('event')} style={{...styles.filterButton, ...(filter === 'event' && styles.filterButtonActive)}}>🎉 Мероприятия</button>
          <button onClick={() => setFilter('maintenance')} style={{...styles.filterButton, ...(filter === 'maintenance' && styles.filterButtonActive)}}>🔧 Работы</button>
          <button onClick={() => setFilter('emergency')} style={{...styles.filterButton, ...(filter === 'emergency' && styles.filterButtonActive)}}>⚠️ Аварии</button>
        </div>

        {filteredNews.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📰</div>
            <div style={styles.emptyText}>Новостей пока нет</div>
          </div>
        ) : (
          <div style={styles.newsList}>
            {filteredNews.map((item) => (
              <article key={item.id} style={styles.newsCard}>
                <div style={styles.newsHeader}>
                  <div style={{...styles.newsType, ...(item.type === 'announcement' && styles.typeAnnouncement), ...(item.type === 'news' && styles.typeNews), ...(item.type === 'event' && styles.typeEvent), ...(item.type === 'maintenance' && styles.typeMaintenance), ...(item.type === 'emergency' && styles.typeEmergency)}}>
                    {getNewsTypeIcon(item.type || "")} {getNewsTypeText(item.type || "")}
                  </div>
                  <div style={styles.newsDate}>{new Date(item.createdAt).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                </div>

                <h2 style={styles.newsTitle}>{item.title}</h2>

                {item.imageUrl && (
                  <div style={styles.newsImage}>
                    <img src={item.imageUrl} alt={item.title} style={styles.image}/>
                  </div>
                )}

                <div style={styles.newsContent}>
                  {item.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} style={styles.paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const getNewsTypeIcon = (type: string) => {
  const iconMap: Record<string, string> = {announcement: '📢', news: '📰', event: '🎉', maintenance: '🔧', emergency: '⚠️'};
  return iconMap[type] || '📰';
};

const getNewsTypeText = (type: string) => {
  const typeMap: Record<string, string> = {announcement: 'Объявление', news: 'Новость', event: 'Мероприятие', maintenance: 'Плановые работы', emergency: 'Аварийная ситуация'};
  return typeMap[type] || type;
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: '#007bff', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  main: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px' },
  filters: { display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' },
  filterButton: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  filterButtonActive: { backgroundColor: '#007bff', color: 'white', borderColor: '#007bff' },
  newsList: { display: 'flex', flexDirection: 'column', gap: '24px' },
  newsCard: { backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  newsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  newsType: { padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '500' },
  typeAnnouncement: { backgroundColor: '#e3f2fd', color: '#1976d2' },
  typeNews: { backgroundColor: '#f3e5f5', color: '#7b1fa2' },
  typeEvent: { backgroundColor: '#fff3e0', color: '#f57c00' },
  typeMaintenance: { backgroundColor: '#fff9c4', color: '#f57f17' },
  typeEmergency: { backgroundColor: '#ffebee', color: '#d32f2f' },
  newsDate: { fontSize: '14px', color: '#666' },
  newsTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', marginTop: 0, lineHeight: 1.3 },
  newsImage: { marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' },
  image: { width: '100%', height: 'auto', display: 'block' },
  newsContent: { fontSize: '16px', lineHeight: 1.7, color: '#333' },
  paragraph: { marginBottom: '16px', marginTop: 0 },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  emptyText: { fontSize: '18px', color: '#666' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default NewsPage;
