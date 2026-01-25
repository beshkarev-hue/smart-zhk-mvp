import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, requestsService } from '../../services/api';

const ManagerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const requests = await requestsService.getAll();
      setStats({
        total: requests.length,
        new: requests.filter((r: any) => r.status === 'new').length,
        inProgress: requests.filter((r: any) => r.status === 'in_progress').length,
        completed: requests.filter((r: any) => r.status === 'completed').length,
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>Умное ЖКХ - Кабинет УК</h1>
          <div style={styles.headerRight}>
            <span style={styles.userName}>{user?.firstName || 'Менеджер'} (УК)</span>
            <button onClick={handleLogout} style={styles.logoutButton}>Выход</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>Панель управления УК</h2>
          <p style={styles.welcomeSubtitle}>Добро пожаловать, {user?.firstName}!</p>
        </section>

        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏘️</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>3</div>
              <div style={styles.statLabel}>Домов в управлении</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>247</div>
              <div style={styles.statLabel}>Жильцов</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.new + stats.inProgress}</div>
              <div style={styles.statLabel}>Активных заявок</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>1.2 млн ₽</div>
              <div style={styles.statLabel}>Собираемость за месяц</div>
            </div>
          </div>
        </section>

        <section style={styles.quickActionsSection}>
          <h3 style={styles.sectionTitle}>Управление</h3>
          <div style={styles.quickActionsGrid}>
            <button onClick={() => navigate('/manager/requests')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📋</div>
              <div style={styles.quickActionTitle}>Заявки жильцов</div>
              {stats.total > 0 && <div style={styles.badge}>{stats.total}</div>}
            </button>

            <button onClick={() => navigate('/manager/residents')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>👥</div>
              <div style={styles.quickActionTitle}>Жильцы</div>
            </button>

            <button onClick={() => navigate('/manager/news')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📰</div>
              <div style={styles.quickActionTitle}>Новости</div>
            </button>

            <button onClick={() => navigate('/manager/payments')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>💳</div>
              <div style={styles.quickActionTitle}>Начисления</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', borderBottom: '1px solid #34495e', padding: '16px 0' },
  headerContent: { maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { fontSize: '16px', color: 'white' },
  logoutButton: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '32px 20px' },
  welcomeSection: { marginBottom: '32px' },
  welcomeTitle: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 },
  welcomeSubtitle: { fontSize: '18px', color: '#666', margin: 0 },
  statsSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statIcon: { fontSize: '36px' },
  statContent: { flex: 1 },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#666' },
  quickActionsSection: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', marginTop: 0 },
  quickActionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  quickActionCard: { position: 'relative', backgroundColor: 'white', border: '2px solid #3498db', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  quickActionIcon: { fontSize: '48px', marginBottom: '12px' },
  quickActionTitle: { fontSize: '16px', fontWeight: '500', color: '#2c3e50' },
  badge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' },
};

export default ManagerDashboardPage;
