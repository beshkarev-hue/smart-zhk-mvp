import React, { useEffect, useState } from 'react';
import Logo from '../../components/Logo';
import { colors } from '../../theme/colors';
import { useNavigate } from 'react-router-dom';
import { authService, requestsService } from '../../services/api';
import { Request } from '../../types';

const ExecutorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('assigned');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [action, setAction] = useState<'accept' | 'reject' | 'complete' | null>(null);
  const [comment, setComment] = useState('');
  const [finalCost, setFinalCost] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [photoBeforeUrl, setPhotoBeforeUrl] = useState('');
  const [photoAfterUrl, setPhotoAfterUrl] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    // Обновляем данные пользователя с сервера
    if (currentUser?.id) {
      fetch(`http://localhost:3000/users/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      .then(r => r.json())
      .then(freshUser => {
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(e => console.error(e));
    }
    loadRequests(currentUser?.id);
  }, []);

  const loadRequests = async (userId: string) => {
    try {
      const allRequests = await requestsService.getAll();
      const myRequests = allRequests.filter((r: any) => r.executorId === userId);
      setRequests(myRequests);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (req: Request, actionType: 'accept' | 'reject' | 'complete') => {
    setSelectedRequest(req);
    setAction(actionType);
    setComment(req.executorComment || '');
    setFinalCost(req.finalCost?.toString() || req.estimatedCost?.toString() || '');
    setPhotoBeforeUrl('');
    setPhotoAfterUrl('');
    setShowActionModal(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest || !action) return;

    try {
      let updateData: any = {};

      if (action === 'accept') {
        updateData = {
          status: 'accepted',
          executorAccepted: true,
          executorComment: comment,
        };
      } else if (action === 'reject') {
        if (!rejectionReason.trim()) {
          alert('Укажите причину отказа');
          return;
        }
        updateData = {
          status: 'rejected',
          executorRejected: true,
          executorRejectionReason: rejectionReason,
        };
      } else if (action === 'complete') {
        updateData = {
          status: 'completed',
          executorComment: comment,
          finalCost: finalCost ? parseFloat(finalCost) : undefined,
          completedAt: new Date().toISOString(),
          photosBefore: photoBeforeUrl ? [photoBeforeUrl] : undefined,
          photosAfter: photoAfterUrl ? [photoAfterUrl] : undefined,
        };
      }

      await requestsService.update(selectedRequest.id, updateData);
      
      alert('✅ Заявка обновлена!');
      setShowActionModal(false);
      setSelectedRequest(null);
      setComment('');
      setFinalCost('');
      setRejectionReason('');
      setPhotoBeforeUrl('');
      setPhotoAfterUrl('');
      setAction(null);
      loadRequests(user?.id);
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка обновления заявки');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
      assigned: { bg: '#fff3e0', color: '#f57c00', text: 'Назначена' },
      accepted: { bg: '#e1f5fe', color: '#0288d1', text: 'Принята' },
      in_progress: { bg: '#fff3e0', color: '#f57c00', text: 'В работе' },
      completed: { bg: '#e8f5e9', color: '#388e3c', text: 'Выполнена' },
      closed: { bg: '#f5f5f5', color: '#757575', text: 'Закрыта' },
      rejected: { bg: '#ffebee', color: '#d32f2f', text: 'Отклонена' },
    };
    const s = styles[status] || styles.assigned;
    return <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: s.bg, color: s.color }}>{s.text}</span>;
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'assigned') return r.status === 'assigned';
    if (filter === 'active') return r.status === 'accepted' || r.status === 'in_progress';
    if (filter === 'completed') return r.status === 'completed' || r.status === 'closed';
    return true;
  });

  const stats = {
    assigned: requests.filter(r => r.status === 'assigned').length,
    active: requests.filter(r => r.status === 'accepted' || r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed' || r.status === 'closed').length,
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Logo size="medium" showText={false} />
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.firstName} {user?.lastName}</div>
              <div style={styles.userPosition}>{user?.position}</div>
              <div style={styles.userRating}>⭐ {user?.rating || 0}/5 ({user?.ratingsCount || 0} оценок)</div>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>Выход</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.assigned}</div>
            <div style={styles.statLabel}>Новых назначений</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.active}</div>
            <div style={styles.statLabel}>В работе</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.completed}</div>
            <div style={styles.statLabel}>Выполнено</div>
          </div>
        </section>

        <section style={styles.filtersSection}>
          <button onClick={() => setFilter('assigned')} style={filter === 'assigned' ? styles.filterActive : styles.filter}>Новые ({stats.assigned})</button>
          <button onClick={() => setFilter('active')} style={filter === 'active' ? styles.filterActive : styles.filter}>В работе ({stats.active})</button>
          <button onClick={() => setFilter('completed')} style={filter === 'completed' ? styles.filterActive : styles.filter}>Выполненные ({stats.completed})</button>
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
                {req.deadline && (
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>⏰ Срок:</span>
                    <span>{new Date(req.deadline).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>

              {req.photosBefore && req.photosBefore.length > 0 && (
                <div style={styles.photosSection}>
                  <div style={styles.photosLabel}>📸 Фото проблемы:</div>
                  <div style={styles.photosGrid}>
                    {req.photosBefore.map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={styles.photoLink}>
                        <img src={url} alt={`Проблема ${idx + 1}`} style={styles.photoThumb} onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {req.photosAfter && req.photosAfter.length > 0 && (
                <div style={styles.photosSection}>
                  <div style={styles.photosLabel}>📸 Фото после работы:</div>
                  <div style={styles.photosGrid}>
                    {req.photosAfter.map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={styles.photoLink}>
                        <img src={url} alt={`После ${idx + 1}`} style={styles.photoThumb} onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {req.estimatedCost !== undefined && (
                <div style={styles.costBox}>
                  💰 Плановая стоимость: {req.isFree ? 'Бесплатно' : `${req.estimatedCost.toLocaleString('ru-RU')} ₽`}
                  {req.estimateDetails && <div style={styles.costDetails}>{req.estimateDetails}</div>}
                </div>
              )}

              {req.response && (
                <div style={styles.commentBox}>
                  <strong>Комментарий УК:</strong> {req.response}
                </div>
              )}

              {req.residentApproval !== null && req.residentApproval !== undefined && (
                <div style={req.residentApproval ? styles.residentApprovedBox : styles.residentRejectedBox}>
                  <strong>{req.residentApproval ? '✓ Работа принята жильцом' : '✗ Работа отклонена жильцом'}</strong>
                  {req.executorRating && req.residentApproval && (
                    <div style={styles.ratingDisplay}>
                      Оценка: {'⭐'.repeat(req.executorRating)} ({req.executorRating}/5)
                    </div>
                  )}
                  {req.residentComment && <div style={styles.residentCommentText}>Комментарий: {req.residentComment}</div>}
                  {req.residentRejectionReason && <div style={styles.residentCommentText}>Причина отказа: {req.residentRejectionReason}</div>}
                </div>
              )}

              <div style={styles.actions}>
                {req.status === 'assigned' && (
                  <>
                    <button onClick={() => handleAction(req, 'accept')} style={styles.acceptButton}>✓ Принять</button>
                    <button onClick={() => handleAction(req, 'reject')} style={styles.rejectButton}>✗ Отклонить</button>
                  </>
                )}
                {(req.status === 'accepted' || req.status === 'in_progress') && (
                  <button onClick={() => handleAction(req, 'complete')} style={styles.completeButton}>✓ Завершить работу</button>
                )}
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div style={styles.emptyState}>Нет заявок</div>
          )}
        </section>
      </main>

      {showActionModal && selectedRequest && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>
              {action === 'accept' && 'Принять заявку'}
              {action === 'reject' && 'Отклонить заявку'}
              {action === 'complete' && 'Завершить работу'}
            </h3>
            <p style={styles.modalSubtitle}>{selectedRequest.title}</p>

            {action === 'reject' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Причина отказа *</label>
                <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} style={styles.textarea} rows={3} placeholder="Укажите причину..." />
              </div>
            )}

            {action === 'complete' && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Финальная стоимость (₽)</label>
                  <input type="number" value={finalCost} onChange={(e) => setFinalCost(e.target.value)} style={styles.input} placeholder="5000" />
                  <small style={styles.hint}>Можно изменить если стоимость отличается от плановой</small>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Фото ДО работы (опционально)</label>
                  <input type="text" value={photoBeforeUrl} onChange={(e) => setPhotoBeforeUrl(e.target.value)} style={styles.input} placeholder="https://i.imgur.com/before.jpg" />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Фото ПОСЛЕ работы (опционально)</label>
                  <input type="text" value={photoAfterUrl} onChange={(e) => setPhotoAfterUrl(e.target.value)} style={styles.input} placeholder="https://i.imgur.com/after.jpg" />
                </div>
              </>
            )}

            {action !== 'reject' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Комментарий</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} style={styles.textarea} rows={3} placeholder="Дополнительная информация..." />
              </div>
            )}

            <div style={styles.modalActions}>
              <button onClick={() => { setShowActionModal(false); setComment(''); setFinalCost(''); setRejectionReason(''); setPhotoBeforeUrl(''); setPhotoAfterUrl(''); }} style={styles.cancelButton}>Отмена</button>
              <button onClick={handleSubmitAction} style={action === 'reject' ? styles.rejectButtonModal : styles.saveButton}>
                {action === 'accept' && 'Принять'}
                {action === 'reject' && 'Отклонить'}
                {action === 'complete' && 'Завершить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: 'rgba(124, 179, 66, 0.08)' },
  header: { backgroundColor: 'rgba(124, 179, 66, 0.15)', borderBottom: `2px solid ${colors.primary}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '12px 0' },
  headerContent: { maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: '600', color: '#000', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  userInfo: { textAlign: 'right' },
  userName: { fontSize: '16px', color: '#000', fontWeight: '600' },
  userPosition: { fontSize: '13px', color: '#95a5a6' },
  userRating: { fontSize: '14px', color: '#f39c12', marginTop: '4px' },
  logoutButton: { padding: '8px 16px', backgroundColor: '#e74c3c', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '32px 20px' },
  statsSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
  statCard: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statValue: { fontSize: '36px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' },
  statLabel: { fontSize: '14px', color: '#666' },
  filtersSection: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  filter: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  filterActive: { padding: '8px 16px', backgroundColor: '#3498db', color: '#000', border: '1px solid #3498db', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  requestCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  requestType: { display: 'flex', alignItems: 'center', gap: '8px' },
  typeIcon: { fontSize: '24px' },
  typeName: { fontSize: '14px', color: '#666', fontWeight: '500' },
  requestTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '12px', marginTop: 0 },
  requestDesc: { fontSize: '15px', color: '#555', marginBottom: '16px', lineHeight: '1.6' },
  requestMeta: { display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' },
  metaItem: { display: 'flex', gap: '8px', fontSize: '14px' },
  metaLabel: { color: '#666', fontWeight: '500' },
  photosSection: { marginBottom: '16px' },
  photosLabel: { fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666' },
  photosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' },
  photoLink: { display: 'block', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd' },
  photoThumb: { width: '100%', height: '120px', objectFit: 'cover', display: 'block' },
  costBox: { backgroundColor: '#fff3e0', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', borderLeft: '4px solid #ff9800' },
  costDetails: { marginTop: '8px', fontSize: '13px', color: '#666', fontStyle: 'italic' },
  commentBox: { backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', borderLeft: '4px solid #4caf50' },
  residentApprovedBox: { backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #4caf50' },
  residentRejectedBox: { backgroundColor: '#ffebee', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #e74c3c' },
  ratingDisplay: { fontSize: '16px', marginTop: '8px', color: '#f57c00', fontWeight: '500' },
  residentCommentText: { fontSize: '14px', marginTop: '8px', color: '#555', fontStyle: 'italic' },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  acceptButton: { flex: 1, padding: '12px', backgroundColor: '#27ae60', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
  rejectButton: { flex: 1, padding: '12px', backgroundColor: '#e74c3c', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
  completeButton: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '18px' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', borderRadius: '8px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' },
  modalTitle: { fontSize: '24px', fontWeight: '600', marginBottom: '8px', marginTop: 0 },
  modalSubtitle: { fontSize: '16px', color: '#666', marginBottom: '24px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' },
  hint: { display: 'block', marginTop: '4px', fontSize: '12px', color: '#999' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelButton: { padding: '10px 20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  saveButton: { padding: '10px 20px', backgroundColor: '#27ae60', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  rejectButtonModal: { padding: '10px 20px', backgroundColor: '#e74c3c', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default ExecutorDashboardPage;
