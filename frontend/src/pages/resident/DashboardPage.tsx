import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, requestsService } from '../../services/api';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeRequests: 0,
    hasUpdates: false,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const requests = await requestsService.getByUser(authService.getCurrentUser()?.id || '');
      const active = requests.filter((r: any) => r.status === 'new' || r.status === 'assigned' || r.status === 'accepted' || r.status === 'in_progress').length;
      
      // Проверяем есть ли непросмотренные обновления
      const lastVisit = localStorage.getItem('resident_last_visit') || '0';
      const hasNew = requests.some((r: any) => 
        (r.response || r.assignedTo || r.executorComment || r.status === 'completed') &&
        new Date(r.updatedAt || r.createdAt).getTime() > parseInt(lastVisit)
      );
      
      setStats({
        activeRequests: active,
        hasUpdates: hasNew,
      });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleNavigateToRequests = () => {
    // Сохраняем время посещения
    localStorage.setItem('resident_last_visit', Date.now().toString());
    navigate('/resident/requests');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>Отта</h1>
          <div style={styles.headerRight}>
            <span style={styles.userName}>{user?.firstName || 'Пользователь'}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>Выход</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>
            Добро пожаловать, {user?.firstName || 'Пользователь'}!
          </h2>
          {user?.buildingAddress && user?.apartmentNumber && (
            <p style={styles.welcomeAddress}>
              {user.buildingAddress}, кв. {user.apartmentNumber}
            </p>
          )}
        </section>

        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💳</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>0 ₽</div>
              <div style={styles.statLabel}>Задолженность</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.activeRequests}</div>
              <div style={styles.statLabel}>Активных заявок</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🧾</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>0</div>
              <div style={styles.statLabel}>Неоплаченных счетов</div>
            </div>
          </div>
        </section>

        <section style={styles.quickActionsSection}>
          <h3 style={styles.sectionTitle}>Быстрые действия</h3>
          <div style={styles.quickActionsGrid}>
            <button onClick={() => navigate('/resident/payments')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>💳</div>
              <div style={styles.quickActionTitle}>Оплата ЖКУ</div>
            </button>

            <button onClick={() => navigate('/resident/meters')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📊</div>
              <div style={styles.quickActionTitle}>Показания счётчиков</div>
            </button>

            <button onClick={handleNavigateToRequests} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📋</div>
              <div style={styles.quickActionTitle}>Мои заявки</div>
              {stats.activeRequests > 0 && <div style={styles.badge}>{stats.activeRequests}</div>}
              {stats.hasUpdates && <div style={styles.updateBadge}></div>}
            </button>

            <button onClick={() => navigate('/resident/news')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📰</div>
              <div style={styles.quickActionTitle}>Новости</div>
            </button>

            <button onClick={() => navigate('/resident/profile')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>👤</div>
              <div style={styles.quickActionTitle}>Профиль</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: 'bold', color: '#007bff', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { fontSize: '16px', color: '#333' },
  logoutButton: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  welcomeSection: { marginBottom: '32px' },
  welcomeTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 },
  welcomeAddress: { fontSize: '16px', color: '#666', margin: 0 },
  statsSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statIcon: { fontSize: '36px' },
  statContent: { flex: 1 },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#666' },
  quickActionsSection: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', marginTop: 0 },
  quickActionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' },
  quickActionCard: { position: 'relative', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  quickActionIcon: { fontSize: '48px', marginBottom: '12px' },
  quickActionTitle: { fontSize: '14px', fontWeight: '500', color: '#333' },
  badge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' },
  updateBadge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', borderRadius: '50%', width: '12px', height: '12px' },
};

export default DashboardPage;
