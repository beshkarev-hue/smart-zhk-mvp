import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { paymentsService } from '../../services/api';
import { requestsService } from '../../services/api';
import { User, Payment, Request } from '../../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);

      const [paymentsData, requestsData] = await Promise.all([
        paymentsService.getByUser(currentUser.id),
        requestsService.getByUser(currentUser.id),
      ]);

      setPayments(paymentsData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  const unpaidPayments = payments.filter((p) => p.status === 'pending');
  const totalDebt = unpaidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const activeRequests = requests.filter((r) => r.status === 'new' || r.status === 'in_progress');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>Умное ЖКХ</h1>
          <div style={styles.userInfo}>
            <span>{user?.firstName} {user?.lastName}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>Выход</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.welcomeSection}>
          <h2>Добро пожаловать, {user?.firstName}!</h2>
          <p style={styles.subtitle}>{user?.buildingAddress}, кв. {user?.apartmentNumber}</p>
        </section>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Задолженность</div>
            <div style={styles.statValue}>{totalDebt.toLocaleString('ru-RU')} ₽</div>
            <Link to="/resident/payments" style={styles.statLink}>Посмотреть →</Link>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>Активных заявок</div>
            <div style={styles.statValue}>{activeRequests.length}</div>
            <Link to="/resident/requests" style={styles.statLink}>Посмотреть →</Link>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>Счетов к оплате</div>
            <div style={styles.statValue}>{unpaidPayments.length}</div>
            <Link to="/resident/payments" style={styles.statLink}>Оплатить →</Link>
          </div>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Быстрые действия</h3>
          <div style={styles.actionsGrid}>
            <Link to="/resident/payments" style={styles.actionCard}>
              <div style={styles.actionIcon}>💳</div>
              <div style={styles.actionTitle}>Оплата ЖКУ</div>
              <div style={styles.actionDesc}>Просмотр и оплата счетов</div>
            </Link>

            <Link to="/resident/requests/new" style={styles.actionCard}>
              <div style={styles.actionIcon}>🔧</div>
              <div style={styles.actionTitle}>Создать заявку</div>
              <div style={styles.actionDesc}>Сообщить о проблеме</div>
            </Link>

            <Link to="/resident/news" style={styles.actionCard}>
              <div style={styles.actionIcon}>📰</div>
              <div style={styles.actionTitle}>Новости</div>
              <div style={styles.actionDesc}>Объявления и события</div>
            </Link>

            <Link to="/resident/profile" style={styles.actionCard}>
              <div style={styles.actionIcon}>👤</div>
              <div style={styles.actionTitle}>Профиль</div>
              <div style={styles.actionDesc}>Личные данные</div>
            </Link>
          </div>
        </section>

        {requests.length > 0 && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Последние заявки</h3>
            <div style={styles.requestsList}>
              {requests.slice(0, 3).map((request) => (
                <div key={request.id} style={styles.requestCard}>
                  <div>
                    <div style={styles.requestTitle}>{request.title}</div>
                    <div style={styles.requestDate}>{new Date(request.createdAt).toLocaleDateString('ru-RU')}</div>
                  </div>
                  <div style={{...styles.requestStatus, ...(request.status === 'new' && styles.statusNew), ...(request.status === 'in_progress' && styles.statusInProgress), ...(request.status === 'completed' && styles.statusCompleted)}}>
                    {getStatusText(request.status)}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/resident/requests" style={styles.sectionLink}>Смотреть все заявки →</Link>
          </section>
        )}
      </main>
    </div>
  );
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    new: 'Новая',
    in_progress: 'В работе',
    completed: 'Выполнена',
    rejected: 'Отклонена',
  };
  return statusMap[status] || status;
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: 'bold', color: '#007bff', margin: 0 },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
  logoutButton: { padding: '8px 16px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  welcomeSection: { marginBottom: '32px' },
  subtitle: { color: '#666', margin: '8px 0 0 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statTitle: { fontSize: '14px', color: '#666', marginBottom: '8px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' },
  statLink: { color: '#007bff', textDecoration: 'none', fontSize: '14px' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  actionCard: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer' },
  actionIcon: { fontSize: '32px', marginBottom: '12px' },
  actionTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
  actionDesc: { fontSize: '14px', color: '#666' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' },
  requestCard: { backgroundColor: 'white', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  requestTitle: { fontWeight: '500', marginBottom: '4px' },
  requestDate: { fontSize: '14px', color: '#666' },
  requestStatus: { padding: '4px 12px', borderRadius: '12px', fontSize: '14px' },
  statusNew: { backgroundColor: '#e3f2fd', color: '#1976d2' },
  statusInProgress: { backgroundColor: '#fff3e0', color: '#f57c00' },
  statusCompleted: { backgroundColor: '#e8f5e9', color: '#388e3c' },
  sectionLink: { color: '#007bff', textDecoration: 'none' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default DashboardPage;
