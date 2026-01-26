import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestsService, usersService } from '../../services/api';
import { Request } from '../../types';

interface Executor {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  rating: number;
  ratingsCount: number;
  phone: string;
}

const ManagerRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [selectedExecutorId, setSelectedExecutorId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [estimatedCost, setEstimatedCost] = useState('');
  const [estimateDetails, setEstimateDetails] = useState('');
  const [executorComment, setExecutorComment] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, executorsData] = await Promise.all([
        requestsService.getAll(),
        usersService.getExecutors(),
      ]);
      setRequests(requestsData);
      setExecutors(executorsData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequest = async (requestId: string) => {
    if (!window.confirm('Вы уверены что хотите закрыть заказ-наряд?')) return;
    try {
      await requestsService.update(requestId, { status: 'closed', closedAt: new Date().toISOString() });
      alert('✅ Заказ-наряд закрыт!');
      loadData();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка закрытия заказа');
    }
  };

  const handleOpenManage = (req: Request) => {
    setSelectedRequest(req);
    setResponse(req.response || '');
    setNewStatus(req.status);
    setSelectedExecutorId(req.executorId || '');
    setDeadline(req.deadline ? new Date(req.deadline).toISOString().slice(0, 16) : '');
    setIsFree(req.isFree ?? true);
    setEstimatedCost(req.estimatedCost?.toString() || '');
    setEstimateDetails(req.estimateDetails || '');
    setExecutorComment(req.executorComment || '');
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const selectedExecutor = executors.find(e => e.id === selectedExecutorId);
      const assignedTo = selectedExecutor 
        ? `${selectedExecutor.lastName} ${selectedExecutor.firstName.charAt(0)}.${selectedExecutor.middleName?.charAt(0) || ''}.`
        : undefined;

      const updateData: any = {
        status: selectedExecutorId ? 'assigned' : newStatus,
        response,
        executorId: selectedExecutorId || undefined,
        assignedTo,
        assignedPosition: selectedExecutor?.position,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        isFree,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        estimateDetails: estimateDetails || undefined,
        executorComment: executorComment || undefined,
      };

      await requestsService.update(selectedRequest.id, updateData);
      
      alert('✅ Заявка обновлена!');
      setSelectedRequest(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('❌ Ошибка обновления заявки');
    }
  };

  const resetForm = () => {
    setResponse('');
    setNewStatus('');
    setSelectedExecutorId('');
    setDeadline('');
    setIsFree(true);
    setEstimatedCost('');
    setEstimateDetails('');
    setExecutorComment('');
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      plumbing: '🚰',
      electricity: '💡',
      heating: '🔥',
      cleaning: '🧹',
      repair: '🔧',
      other: '📝',
    };
    return icons[type] || '📝';
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      plumbing: 'Сантехника',
      electricity: 'Электрика',
      heating: 'Отопление',
      cleaning: 'Уборка',
      repair: 'Ремонт',
      other: 'Другое',
    };
    return names[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, any> = {
      new: { bg: '#e3f2fd', color: '#1976d2', text: 'Новая' },
      assigned: { bg: '#fff3e0', color: '#f57c00', text: 'Назначена' },
      accepted: { bg: '#e1f5fe', color: '#0288d1', text: 'Принята' },
      in_progress: { bg: '#fff3e0', color: '#f57c00', text: 'В работе' },
      completed: { bg: '#e8f5e9', color: '#388e3c', text: 'Выполнена' },
      closed: { bg: '#f5f5f5', color: '#757575', text: 'Закрыта' },
      rejected: { bg: '#ffebee', color: '#d32f2f', text: 'Отклонена' },
    };
    const s = styles[status] || styles.new;
    return <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: s.bg, color: s.color }}>{s.text}</span>;
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'new') return r.status === 'new';
    if (filter === 'assigned') return r.status === 'assigned';
    if (filter === 'in_progress') return r.status === 'accepted' || r.status === 'in_progress';
    if (filter === 'completed') return r.status === 'completed' || r.status === 'closed';
    return true;
  });

  const stats = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    in_progress: requests.filter(r => r.status === 'in_progress' || r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed' || r.status === 'closed').length,
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/manager/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Заявки жильцов</h1>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.all}</div>
            <div style={styles.statLabel}>Всего заявок</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.new}</div>
            <div style={styles.statLabel}>Новых</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.assigned}</div>
            <div style={styles.statLabel}>Назначено</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.in_progress}</div>
            <div style={styles.statLabel}>В работе</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.completed}</div>
            <div style={styles.statLabel}>Выполнено</div>
          </div>
        </section>

        <section style={styles.filtersSection}>
          <button onClick={() => setFilter('all')} style={filter === 'all' ? styles.filterActive : styles.filter}>Все</button>
          <button onClick={() => setFilter('new')} style={filter === 'new' ? styles.filterActive : styles.filter}>Новые</button>
          <button onClick={() => setFilter('assigned')} style={filter === 'assigned' ? styles.filterActive : styles.filter}>Назначено</button>
          <button onClick={() => setFilter('in_progress')} style={filter === 'in_progress' ? styles.filterActive : styles.filter}>В работе</button>
          <button onClick={() => setFilter('completed')} style={filter === 'completed' ? styles.filterActive : styles.filter}>Выполненные</button>
        </section>

        <section style={styles.requestsList}>
          {filteredRequests.map((req) => (
            <div key={req.id} style={styles.requestCard}>
              <div style={styles.requestHeader}>
                <div style={styles.requestType}>
                  <span style={styles.typeIcon}>{getTypeIcon(req.type)}</span>
                  <span style={styles.typeName}>{getTypeName(req.type)}</span>
                </div>
                {getStatusBadge(req.status)}
              </div>

              <h3 style={styles.requestTitle}>{req.title}</h3>
              <p style={styles.requestDesc}>{req.description}</p>

              <div style={styles.requestMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>📍 Адрес:</span>
                  <span>{req.buildingAddress}, кв. {req.apartmentNumber}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>📅 Создана:</span>
                  <span>{new Date(req.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              {req.assignedTo && (
                <div style={styles.assignedBox}>
                  <strong>👷 Исполнитель:</strong> {req.assignedTo} ({req.assignedPosition})
                  {req.deadline && <div style={styles.deadline}>⏰ Срок: {new Date(req.deadline).toLocaleDateString('ru-RU')}</div>}
                </div>
              )}

              {req.estimatedCost !== undefined && req.estimatedCost !== null && (
                <div style={styles.costBox}>
                  <strong>💰 Стоимость:</strong> {req.isFree ? 'Бесплатно' : `${req.estimatedCost?.toLocaleString('ru-RU')} ₽`}
                </div>
              )}

              {req.response && (
                <div style={styles.responseBox}>
                  <strong>Ответ УК:</strong> {req.response}
                </div>
              )}

              {req.executorComment && (
                <div style={styles.executorBox}>
                  <strong>Комментарий исполнителя:</strong> {req.executorComment}
                </div>
              )}

              {req.residentApproval !== null && req.residentApproval !== undefined && (
                <div style={req.residentApproval ? styles.residentApprovedBox : styles.residentRejectedBox}>
                  <strong>{req.residentApproval ? '✓ Работа принята жильцом' : '✗ Работа отклонена жильцом'}</strong>
                  {req.executorRating && req.residentApproval && (
                    <div style={styles.ratingDisplay}>
                      Оценка исполнителя: {'⭐'.repeat(req.executorRating)} ({req.executorRating}/5)
                    </div>
                  )}
                  {req.residentComment && <div style={styles.residentCommentText}>Комментарий жильца: {req.residentComment}</div>}
                  {req.residentRejectionReason && <div style={styles.residentCommentText}>Причина отказа: {req.residentRejectionReason}</div>}
                </div>
              )}

              {req.status === 'completed' && req.residentApproval && (
                <button onClick={() => handleCloseRequest(req.id)} style={styles.closeButton}>
                  Закрыть заказ-наряд
                </button>
              )}

              {req.status !== 'closed' && (
                <button onClick={() => handleOpenManage(req)} style={styles.manageButton}>
                  Управление заявкой
                </button>
              )}
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div style={styles.emptyState}>Нет заявок</div>
          )}
        </section>
      </main>

      {selectedRequest && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Управление заявкой</h3>
            <p style={styles.modalSubtitle}>{selectedRequest.title}</p>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Назначить исполнителя</label>
                <select value={selectedExecutorId} onChange={(e) => setSelectedExecutorId(e.target.value)} style={styles.select}>
                  <option value="">Не назначен</option>
                  {executors.map((executor) => (
                    <option key={executor.id} value={executor.id}>
                      {executor.lastName} {executor.firstName} - {executor.position} (⭐ {executor.rating}/5)
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Срок исполнения</label>
                <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={styles.input} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} style={{marginRight: '8px'}} />
                Бесплатно
              </label>
            </div>

            {!isFree && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Стоимость работ (₽)</label>
                <input type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} style={styles.input} placeholder="5000" />
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Детали сметы</label>
              <textarea value={estimateDetails} onChange={(e) => setEstimateDetails(e.target.value)} style={styles.textarea} rows={3} placeholder="Материалы, работы..." />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Комментарий для исполнителя</label>
              <textarea value={executorComment} onChange={(e) => setExecutorComment(e.target.value)} style={styles.textarea} rows={2} placeholder="Особые указания..." />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Ответ жильцу</label>
              <textarea value={response} onChange={(e) => setResponse(e.target.value)} style={styles.textarea} rows={3} placeholder="Ответ..." />
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => { setSelectedRequest(null); resetForm(); }} style={styles.cancelButton}>Отмена</button>
              <button onClick={handleUpdateRequest} style={styles.saveButton}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', borderBottom: '1px solid #34495e', padding: '16px 0' },
  headerContent: { maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: 'white', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '32px 20px' },
  statsSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' },
  statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' },
  statLabel: { fontSize: '14px', color: '#666' },
  filtersSection: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  filter: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  filterActive: { padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: '1px solid #3498db', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  requestCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  requestType: { display: 'flex', alignItems: 'center', gap: '8px' },
  typeIcon: { fontSize: '24px' },
  typeName: { fontSize: '14px', color: '#666', fontWeight: '500' },
  requestTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', marginTop: 0 },
  requestDesc: { fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.5' },
  requestMeta: { display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' },
  metaItem: { display: 'flex', gap: '8px', fontSize: '14px' },
  metaLabel: { color: '#666' },
  assignedBox: { backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '12px', borderLeft: '4px solid #2196f3' },
  deadline: { marginTop: '8px', fontSize: '13px', color: '#666' },
  costBox: { backgroundColor: '#fff3e0', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '12px', borderLeft: '4px solid #ff9800' },
  responseBox: { backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '12px', borderLeft: '4px solid #4caf50' },
  executorBox: { backgroundColor: '#f3e5f5', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', borderLeft: '4px solid #9c27b0' },
  residentApprovedBox: { backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #4caf50' },
  residentRejectedBox: { backgroundColor: '#ffebee', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #e74c3c' },
  ratingDisplay: { fontSize: '16px', marginTop: '8px', color: '#f57c00', fontWeight: '500' },
  residentCommentText: { fontSize: '14px', marginTop: '8px', color: '#555', fontStyle: 'italic' },
  closeButton: { width: '100%', padding: '12px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', marginBottom: '12px' },
  manageButton: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' },
  modalContent: { backgroundColor: 'white', borderRadius: '8px', padding: '32px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' },
  modalTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 },
  modalSubtitle: { fontSize: '16px', color: '#666', marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' },
  select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelButton: { padding: '10px 20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  saveButton: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '18px' },
  photosSection: { marginBottom: '16px' },
  photosLabel: { fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666' },
  photosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' },
  photoLink: { display: 'block', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd' },
  photoThumb: { width: '100%', height: '120px', objectFit: 'cover', display: 'block' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default ManagerRequestsPage;
