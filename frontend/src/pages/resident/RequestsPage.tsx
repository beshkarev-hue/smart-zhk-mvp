import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestsService } from '../../services/api';
import { authService } from '../../services/api';
import { Request } from '../../types';

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      const data = await requestsService.getByUser(user.id);
      setRequests(data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((r) => filter === 'all' ? true : r.status === filter);

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Мои заявки</h1>
          <Link to="/resident/requests/new" style={styles.createButton}>+ Создать заявку</Link>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{requests.length}</div>
            <div style={styles.statLabel}>Всего заявок</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{requests.filter((r) => r.status === 'new').length}</div>
            <div style={styles.statLabel}>Новые</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{requests.filter((r) => r.status === 'in_progress').length}</div>
            <div style={styles.statLabel}>В работе</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{requests.filter((r) => r.status === 'completed').length}</div>
            <div style={styles.statLabel}>Выполнено</div>
          </div>
        </div>

        <div style={styles.filters}>
          <button onClick={() => setFilter('all')} style={{...styles.filterButton, ...(filter === 'all' && styles.filterButtonActive)}}>Все</button>
          <button onClick={() => setFilter('new')} style={{...styles.filterButton, ...(filter === 'new' && styles.filterButtonActive)}}>Новые</button>
          <button onClick={() => setFilter('in_progress')} style={{...styles.filterButton, ...(filter === 'in_progress' && styles.filterButtonActive)}}>В работе</button>
          <button onClick={() => setFilter('completed')} style={{...styles.filterButton, ...(filter === 'completed' && styles.filterButtonActive)}}>Выполнено</button>
        </div>

        {filteredRequests.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyText}>Заявок не найдено</div>
            <Link to="/resident/requests/new" style={styles.emptyButton}>Создать первую заявку</Link>
          </div>
        ) : (
          <div style={styles.requestsList}>
            {filteredRequests.map((request) => (
              <div key={request.id} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <div style={styles.requestType}>{getRequestTypeIcon(request.type)} {getRequestTypeText(request.type)}</div>
                  <div style={{...styles.requestStatus, ...(request.status === 'new' && styles.statusNew), ...(request.status === 'in_progress' && styles.statusInProgress), ...(request.status === 'completed' && styles.statusCompleted), ...(request.status === 'rejected' && styles.statusRejected)}}>
                    {getStatusText(request.status)}
                  </div>
                </div>

                <div style={styles.requestTitle}>{request.title}</div>
                <div style={styles.requestDescription}>{request.description}</div>

                <div style={styles.requestFooter}>
                  <div style={styles.requestDate}>Создана: {new Date(request.createdAt).toLocaleDateString('ru-RU')}</div>
                  {request.apartmentNumber && (
                    <div style={styles.requestLocation}>📍 {request.buildingAddress}, кв. {request.apartmentNumber}</div>
                  )}
                </div>

                {request.response && (
                  <div style={styles.requestResponse}>
                    <div style={styles.responseLabel}>Ответ УК:</div>
                    <div style={styles.responseText}>{request.response}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const getRequestTypeIcon = (type: string) => {
  const iconMap: Record<string, string> = {repair: '🔨', plumbing: '🚰', electricity: '💡', heating: '🔥', cleaning: '🧹', garbage: '🗑️', elevator: '🛗', intercom: '📞', other: '📝'};
  return iconMap[type] || '📝';
};

const getRequestTypeText = (type: string) => {
  const typeMap: Record<string, string> = {repair: 'Ремонт', plumbing: 'Сантехника', electricity: 'Электрика', heating: 'Отопление', cleaning: 'Уборка', garbage: 'Вывоз мусора', elevator: 'Лифт', intercom: 'Домофон', other: 'Другое'};
  return typeMap[type] || type;
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {new: 'Новая', in_progress: 'В работе', completed: 'Выполнена', rejected: 'Отклонена'};
  return statusMap[status] || status;
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: '#007bff', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0, flex: 1 },
  createButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '32px' },
  statItem: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statValue: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' },
  statLabel: { fontSize: '14px', color: '#666' },
  filters: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  filterButton: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  filterButtonActive: { backgroundColor: '#007bff', color: 'white', borderColor: '#007bff' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  requestCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  requestType: { fontSize: '14px', color: '#666', fontWeight: '500' },
  requestStatus: { padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '500' },
  statusNew: { backgroundColor: '#e3f2fd', color: '#1976d2' },
  statusInProgress: { backgroundColor: '#fff3e0', color: '#f57c00' },
  statusCompleted: { backgroundColor: '#e8f5e9', color: '#388e3c' },
  statusRejected: { backgroundColor: '#ffebee', color: '#d32f2f' },
  requestTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' },
  requestDescription: { fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: 1.6 },
  requestFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', paddingTop: '12px', borderTop: '1px solid #eee' },
  requestDate: {},
  requestLocation: {},
  requestResponse: { marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', borderLeft: '3px solid #007bff' },
  responseLabel: { fontSize: '12px', fontWeight: '600', color: '#007bff', marginBottom: '4px' },
  responseText: { fontSize: '14px', color: '#333' },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  emptyText: { fontSize: '18px', color: '#666', marginBottom: '24px' },
  emptyButton: { display: 'inline-block', padding: '12px 24px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default RequestsPage;
