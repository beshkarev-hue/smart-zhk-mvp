import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, requestsService } from '../../services/api';
import Logo from '../../components/Logo';
import { colors } from '../../theme/colors';

const ManagerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeRequests: 0,
    newRequests: 0,
    awaitingApproval: 0,
    hasNotifications: false,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const requests = await requestsService.getAll();
      const newReqs = requests.filter((r: any) => r.status === 'new').length;
      const awaitingReqs = requests.filter((r: any) => r.status === 'completed' && r.residentApproval === null).length;
      const active = requests.filter((r: any) => 
        r.status === 'new' || r.status === 'assigned' || r.status === 'in_progress' || r.status === 'accepted'
      ).length;
      
      const lastVisit = localStorage.getItem('manager_last_visit') || '0';
      const hasNew = requests.some((r: any) => 
        (r.status === 'new' || (r.status === 'completed' && r.residentApproval === null)) &&
        new Date(r.updatedAt || r.createdAt).getTime() > parseInt(lastVisit)
      );
      
      setStats({
        activeRequests: active,
        newRequests: newReqs,
        awaitingApproval: awaitingReqs,
        hasNotifications: hasNew,
      });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleNavigateToRequests = () => {
    localStorage.setItem('manager_last_visit', Date.now().toString());
    navigate('/manager/requests');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Logo size="large" showText={false} />
          <div style={styles.headerRight}>
            <span style={styles.userName}>{user?.firstName || 'Менеджер'}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>Выход</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>
            Добро пожаловать, {user?.firstName || 'Менеджер'}!
          </h2>
          <p style={styles.welcomeSubtitle}>Панель управления УК</p>
        </section>

        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏢</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>3</div>
              <div style={styles.statLabel}>Домов под управлением</div>
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
              <div style={styles.statValue}>{stats.activeRequests}</div>
              <div style={styles.statLabel}>Активных заявок</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>1.2М ₽</div>
              <div style={styles.statLabel}>Сбор в месяц</div>
            </div>
          </div>
        </section>

        <section style={styles.quickActionsSection}>
          <h3 style={styles.sectionTitle}>Быстрые действия</h3>
          <div style={styles.quickActionsGrid}>
            <button onClick={handleNavigateToRequests} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📋</div>
              <div style={styles.quickActionTitle}>Заявки жильцов</div>
              {(stats.newRequests > 0 || stats.awaitingApproval > 0) && (
                <div style={styles.badge}>{stats.newRequests + stats.awaitingApproval}</div>
              )}
              {stats.hasNotifications && <div style={styles.notificationDot}></div>}
            </button>

            <button style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>👥</div>
              <div style={styles.quickActionTitle}>Список жильцов</div>
            </button>

            <button style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📰</div>
              <div style={styles.quickActionTitle}>Новости</div>
            </button>

            <button style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📊</div>
              <div style={styles.quickActionTitle}>Отчёты</div>
            </button>
          </div>
        </section>

        <section style={styles.recentSection}>
          <h3 style={styles.sectionTitle}>Последние события</h3>
          <div style={styles.eventsList}>
            <div style={styles.eventItem}>
              <div style={styles.eventIcon}>📋</div>
              <div style={styles.eventContent}>
                <div style={styles.eventTitle}>Новых заявок: {stats.newRequests}</div>
                <div style={styles.eventTime}>Требуют назначения исполнителя</div>
              </div>
            </div>
            <div style={styles.eventItem}>
              <div style={styles.eventIcon}>✓</div>
              <div style={styles.eventContent}>
                <div style={styles.eventTitle}>Ожидают приёмки: {stats.awaitingApproval}</div>
                <div style={styles.eventTime}>Жильцы ещё не оценили работу</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: 'rgba(124, 179, 66, 0.08)' },
  header: { backgroundColor: 'rgba(124, 179, 66, 0.2)', borderBottom: `2px solid ${colors.primary}`, padding: '12px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { fontSize: '16px', color: '#000', fontWeight: '600' },
  logoutButton: { padding: '8px 16px', backgroundColor: colors.error, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  welcomeSection: { marginBottom: '32px' },
  welcomeTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0, color: colors.text },
  welcomeSubtitle: { fontSize: '16px', color: colors.textLight, margin: 0 },
  statsSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: `2px solid ${colors.light}` },
  statIcon: { fontSize: '36px' },
  statContent: { flex: 1 },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: colors.primary, marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: colors.textLight },
  quickActionsSection: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', marginTop: 0, color: colors.text },
  quickActionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  quickActionCard: { 
    position: 'relative', 
    backgroundColor: 'rgba(30, 136, 229, 0.85)', 
    border: 'none', 
    borderRadius: '12px', 
    padding: '24px', 
    textAlign: 'center', 
    cursor: 'pointer', 
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    color: 'white'
  },
  quickActionIcon: { fontSize: '48px', marginBottom: '12px' },
  quickActionTitle: { fontSize: '16px', fontWeight: '600', color: 'white' },
  badge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: colors.accent, color: 'white', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' },
  notificationDot: { position: 'absolute', top: '10px', right: '10px', backgroundColor: colors.error, borderRadius: '50%', width: '12px', height: '12px' },
  recentSection: { marginBottom: '40px' },
  eventsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  eventItem: { backgroundColor: 'white', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  eventIcon: { fontSize: '32px' },
  eventContent: { flex: 1 },
  eventTitle: { fontSize: '16px', fontWeight: '500', marginBottom: '4px' },
  eventTime: { fontSize: '14px', color: colors.textLight },
};

export default ManagerDashboardPage;
