import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, requestsService, newsService, userNewsReadService } from '../../services/api';
import Logo from '../../components/Logo';
import { colors } from '../../theme/colors';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeRequests: 0,
    hasUpdates: false,
    unreadNews: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [requests, news, readNewsIds] = await Promise.all([
        requestsService.getByUser(authService.getCurrentUser()?.id || ''),
        newsService.getPublished(),
        userNewsReadService.getReadNewsIds(),
      ]);

      const active = requests.filter((r: any) => 
        r.status === 'new' || r.status === 'assigned' || r.status === 'accepted' || r.status === 'in_progress'
      ).length;
      
      const lastVisit = localStorage.getItem('resident_last_visit') || '0';
      const hasNew = requests.some((r: any) => 
        (r.response || r.assignedTo || r.executorComment || r.status === 'completed') &&
        new Date(r.updatedAt || r.createdAt).getTime() > parseInt(lastVisit)
      );

      const unreadNews = news.filter(n => !readNewsIds.includes(n.id)).length;
      
      setStats({
        activeRequests: active,
        hasUpdates: hasNew,
        unreadNews,
      });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleNavigateToRequests = () => {
    localStorage.setItem('resident_last_visit', Date.now().toString());
    navigate('/resident/requests');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Logo size="medium" showText={true} />
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.firstName} {user.lastName}</div>
            <div style={styles.userDetails}>Квартира {user.apartmentNumber}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Личный кабинет жильца</h1>
        
        <div style={styles.grid}>
          <div style={styles.card} onClick={() => navigate('/resident/building-info')}>
            <div style={styles.cardIcon}>🏢</div>
            <h3 style={styles.cardTitle}>Мой дом</h3>
            <p style={styles.cardDescription}>Информация о доме, тарифы, контакты УК</p>
          </div>

          <div style={styles.card} onClick={() => navigate('/resident/meters')}>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Счётчики</h3>
            <p style={styles.cardDescription}>Передача показаний воды и электричества</p>
          </div>

          <div style={styles.card} onClick={() => navigate('/resident/payments')}>
            <div style={styles.cardIcon}>💳</div>
            <h3 style={styles.cardTitle}>Платежи</h3>
            <p style={styles.cardDescription}>История платежей и текущие начисления</p>
          </div>

          <div 
            style={{...styles.card, ...(stats.hasUpdates ? styles.cardWithBadge : {})}} 
            onClick={handleNavigateToRequests}
          >
            {stats.hasUpdates && <div style={styles.updateBadge}>●</div>}
            <div style={styles.cardIcon}>📝</div>
            <h3 style={styles.cardTitle}>Заявки</h3>
            <p style={styles.cardDescription}>
              {stats.activeRequests > 0 ? `Активных: ${stats.activeRequests}` : 'Создать заявку на ремонт'}
            </p>
          </div>

          <div 
            style={styles.card} 
            onClick={() => navigate('/resident/news')}
          >
            {stats.unreadNews > 0 && (
              <div style={styles.badge}>{stats.unreadNews}</div>
            )}
            <div style={styles.cardIcon}>📰</div>
            <h3 style={styles.cardTitle}>Новости</h3>
            <p style={styles.cardDescription}>Объявления и важная информация</p>
          </div>

          <div style={styles.card} onClick={() => navigate('/resident/profile')}>
            <div style={styles.cardIcon}>👤</div>
            <h3 style={styles.cardTitle}>Профиль</h3>
            <p style={styles.cardDescription}>Личные данные и настройки</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  header: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    textAlign: 'right' as const,
  },
  userName: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#333',
  },
  userDetails: {
    fontSize: '14px',
    color: '#666',
  },
  logoutButton: {
    padding: '8px 16px',
    background: colors.error,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '40px',
    color: '#333',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'relative' as const,
  },
  cardWithBadge: {
    position: 'relative' as const,
  },
  badge: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    background: colors.error,
    color: 'white',
    borderRadius: '12px',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center' as const,
  },
  updateBadge: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    color: colors.primary,
    fontSize: '24px',
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#333',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
};

export default DashboardPage;
