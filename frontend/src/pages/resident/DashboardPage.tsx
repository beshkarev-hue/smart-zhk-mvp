import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>Умное ЖКХ</h1>
          <div style={styles.headerRight}>
            <span style={styles.userName}>{user?.firstName || 'Пользователь'}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>Выход</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Welcome Section */}
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

        {/* Stats Cards */}
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
              <div style={styles.statValue}>0</div>
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

        {/* Quick Actions */}
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

            <button onClick={() => navigate('/resident/requests/new')} style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>🔧</div>
              <div style={styles.quickActionTitle}>Создать заявку</div>
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

        {/* Recent Requests */}
        <section style={styles.recentSection}>
          <h3 style={styles.sectionTitle}>Последние заявки</h3>
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>У вас пока нет заявок</p>
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
  quickActionCard: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  quickActionIcon: { fontSize: '48px', marginBottom: '12px' },
  quickActionTitle: { fontSize: '14px', fontWeight: '500', color: '#333' },
  recentSection: {},
  emptyState: { backgroundColor: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center' },
  emptyText: { fontSize: '16px', color: '#999', margin: 0 },
};

export default DashboardPage;
