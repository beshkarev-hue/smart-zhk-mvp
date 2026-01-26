import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestsService, authService, usersService } from '../../services/api';
import { Request } from '../../types';

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [approve, setApprove] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  const [newRequest, setNewRequest] = useState({
    type: 'plumbing',
    title: '',
    description: '',
    photoUrls: [] as string[],
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const userId = authService.getCurrentUser()?.id;
      if (!userId) return;
      
      const data = await requestsService.getByUser(userId);
      setRequests(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      alert('Заполните все поля');
      return;
    }

    try {
      const user = authService.getCurrentUser();
      await requestsService.create({
        ...newRequest,
        userId: user?.id || '',
        apartmentNumber: user?.apartmentNumber,
        buildingAddress: user?.buildingAddress,
      });

      setShowCreateModal(false);
      setNewRequest({ type: 'plumbing', title: '', description: '', photoUrls: [] });
      loadRequests();
      alert('✅ Заявка создана!');
    } catch (error) {
      console.error('Ошибка создания:', error);
      alert('❌ Ошибка создания заявки');
    }
  };

  const handleOpenReview = (req: Request) => {
    setSelectedRequest(req);
    setRating(req.executorRating || 0);
    setComment(req.residentComment || '');
    setApprove(req.residentApproval ?? true);
    setRejectionReason(req.residentRejectionReason || '');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;

    if (!approve && !rejectionReason.trim()) {
      alert('Укажите причину отказа');
      return;
    }

    if (approve && rating === 0) {
      alert('Поставьте оценку исполнителю');
      return;
    }

    try {
      const updateData: any = {
        residentApproval: approve,
        residentComment: comment,
        executorRating: approve ? rating : undefined,
        residentRejectionReason: !approve ? rejectionReason : undefined,
      };

      await requestsService.update(selectedRequest.id, updateData);

      // Обновляем рейтинг исполнителя
      if (approve && rating && selectedRequest.executorId) {
        await usersService.updateRating(selectedRequest.executorId, rating);
      }

      alert('✅ Отзыв отправлен!');
      setShowReviewModal(false);
      setSelectedRequest(null);
      setRating(0);
      setComment('');
      setApprove(true);
      setRejectionReason('');
      loadRequests();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка отправки отзыва');
    }
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
      accepted: { bg: '#e1f5fe', color: '#0288d1', text: 'Принята исполнителем' },
      in_progress: { bg: '#fff3e0', color: '#f57c00', text: 'В работе' },
      completed: { bg: '#e8f5e9', color: '#388e3c', text: 'Ожидает приёмки' },
      closed: { bg: '#f5f5f5', color: '#757575', text: 'Закрыта' },
      rejected: { bg: '#ffebee', color: '#d32f2f', text: 'Отклонена' },
    };
    const s = styles[status] || styles.new;
    return <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: s.bg, color: s.color }}>{s.text}</span>;
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Мои заявки</h1>
          <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>+ Создать заявку</button>
        </div>
      </header>

      <main style={styles.main}>
        {requests.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>У вас пока нет заявок</p>
            <button onClick={() => setShowCreateModal(true)} style={styles.emptyButton}>Создать первую заявку</button>
          </div>
        ) : (
          <div style={styles.requestsList}>
            {requests.map((req) => (
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

                {req.photosBefore && req.photosBefore.length > 0 && (
                  <div style={styles.photosSection}>
                    <div style={styles.photosLabel}>Фото проблемы:</div>
                    <div style={styles.photosGrid}>
                      {req.photosBefore.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={styles.photoLink}>
                          <img src={url} alt={`Фото ${idx + 1}`} style={styles.photoThumb} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.requestMeta}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>📅 Создана:</span>
                    <span>{new Date(req.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>

                {req.assignedTo && (
                  <div style={styles.executorBox}>
                    <div style={styles.executorHeader}>
                      <div style={styles.executorAvatar}>👷</div>
                      <div>
                        <div style={styles.executorName}>{req.assignedTo}</div>
                        <div style={styles.executorPosition}>{req.assignedPosition}</div>
                      </div>
                    </div>
                    {req.deadline && (
                      <div style={styles.executorDeadline}>
                        ⏰ Планируемый визит: {new Date(req.deadline).toLocaleString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    )}
                    {req.finalCost !== undefined ? (
                      <div style={styles.executorCost}>
                        💰 Итоговая стоимость: {req.isFree ? 'Бесплатно' : `${req.finalCost.toLocaleString('ru-RU')} ₽`}
                      </div>
                    ) : req.estimatedCost !== undefined ? (
                      <div style={styles.executorCost}>
                        💰 Плановая стоимость: {req.isFree ? 'Бесплатно' : `${req.estimatedCost.toLocaleString('ru-RU')} ₽`}
                      </div>
                    ) : null}
                    {req.estimateDetails && (
                      <div style={styles.executorDetails}>📋 {req.estimateDetails}</div>
                    )}
                  </div>
                )}

                {req.response && (
                  <div style={styles.responseBox}>
                    <strong>Ответ УК:</strong> {req.response}
                  </div>
                )}

                {req.executorComment && (
                  <div style={styles.commentBox}>
                    <strong>Комментарий исполнителя:</strong> {req.executorComment}
                  </div>
                )}

                {req.residentApproval !== null && req.residentApproval !== undefined && (
                  <div style={req.residentApproval ? styles.approvedBox : styles.rejectedBox}>
                    <strong>{req.residentApproval ? '✓ Работа принята' : '✗ Работа отклонена'}</strong>
                    {req.executorRating && req.residentApproval && (
                      <div style={styles.ratingDisplay}>
                        Ваша оценка: {'⭐'.repeat(req.executorRating)} ({req.executorRating}/5)
                      </div>
                    )}
                    {req.residentComment && <div style={styles.commentText}>Ваш комментарий: {req.residentComment}</div>}
                    {req.residentRejectionReason && <div style={styles.commentText}>Причина отказа: {req.residentRejectionReason}</div>}
                  </div>
                )}

                {req.status === 'completed' && req.residentApproval === null && (
                  <button 
                    onClick={() => handleOpenReview(req)} 
                    style={styles.reviewButton}
                  >
                    ✓ Принять работу / Оставить отзыв
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Создать заявку</h3>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Тип проблемы</label>
              <select value={newRequest.type} onChange={(e) => setNewRequest({...newRequest, type: e.target.value})} style={styles.select}>
                <option value="plumbing">Сантехника</option>
                <option value="electricity">Электрика</option>
                <option value="heating">Отопление</option>
                <option value="cleaning">Уборка</option>
                <option value="repair">Ремонт</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Заголовок</label>
              <input value={newRequest.title} onChange={(e) => setNewRequest({...newRequest, title: e.target.value})} style={styles.input} placeholder="Краткое описание проблемы" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Описание</label>
              <textarea value={newRequest.description} onChange={(e) => setNewRequest({...newRequest, description: e.target.value})} style={styles.textarea} rows={4} placeholder="Подробное описание..." />

            <div style={styles.inputGroup}>
              <label style={styles.label}>Фото проблемы (опционально)</label>
              <input 
                value={newRequest.photoUrls[0] || ''} 
                onChange={(e) => setNewRequest({...newRequest, photoUrls: [e.target.value]})} 
                style={styles.input} 
                placeholder="URL фото (например, https://i.imgur.com/abc.jpg)" 
              />
              <small style={styles.hint}>Можно загрузить фото на imgur.com и вставить ссылку</small>
            </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setShowCreateModal(false)} style={styles.cancelButton}>Отмена</button>
              <button onClick={handleCreateRequest} style={styles.saveButton}>Создать</button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && selectedRequest && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Приёмка работы</h3>
            <p style={styles.modalSubtitle}>{selectedRequest.title}</p>

            <div style={styles.approvalToggle}>
              <button 
                onClick={() => setApprove(true)} 
                style={approve ? styles.approveButtonActive : styles.approveButton}
              >
                ✓ Принять работу
              </button>
              <button 
                onClick={() => setApprove(false)} 
                style={!approve ? styles.rejectButtonActive : styles.rejectButton}
              >
                ✗ Отклонить работу
              </button>
            </div>

            {approve ? (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Оценка исполнителя *</label>
                  <div style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        onClick={() => setRating(star)} 
                        style={{...styles.star, color: star <= rating ? '#ffc107' : '#ddd'}}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Комментарий</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} style={styles.textarea} rows={3} placeholder="Ваш отзыв о работе..." />
                </div>
              </>
            ) : (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Причина отказа *</label>
                <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} style={styles.textarea} rows={3} placeholder="Опишите почему работа не принята..." />
              </div>
            )}

            <div style={styles.modalActions}>
              <button onClick={() => { setShowReviewModal(false); setRating(0); setComment(''); setApprove(true); setRejectionReason(''); }} style={styles.cancelButton}>Отмена</button>
              <button onClick={handleSubmitReview} style={styles.saveButton}>Отправить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backLink: { color: '#007bff', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', flex: 1, textAlign: 'center', margin: 0 },
  createButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  requestCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  requestType: { display: 'flex', alignItems: 'center', gap: '8px' },
  typeIcon: { fontSize: '24px' },
  typeName: { fontSize: '14px', color: '#666', fontWeight: '500' },
  requestTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', marginTop: 0 },
  requestDesc: { fontSize: '15px', color: '#555', marginBottom: '16px', lineHeight: '1.6' },
  requestMeta: { display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' },
  metaItem: { display: 'flex', gap: '8px', fontSize: '14px', color: '#666' },
  metaLabel: { fontWeight: '500' },
  executorBox: { backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #2196f3' },
  executorHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  executorAvatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  executorName: { fontSize: '16px', fontWeight: 'bold', color: '#1976d2' },
  executorPosition: { fontSize: '13px', color: '#666' },
  executorDeadline: { fontSize: '14px', marginBottom: '8px', color: '#333' },
  executorCost: { fontSize: '14px', marginBottom: '8px', fontWeight: '500', color: '#f57c00' },
  executorDetails: { fontSize: '13px', color: '#666', fontStyle: 'italic' },
  responseBox: { backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '12px', borderLeft: '4px solid #4caf50' },
  commentBox: { backgroundColor: '#f3e5f5', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '12px', borderLeft: '4px solid #9c27b0' },
  approvedBox: { backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', marginBottom: '12px', borderLeft: '4px solid #4caf50' },
  rejectedBox: { backgroundColor: '#ffebee', padding: '16px', borderRadius: '8px', marginBottom: '12px', borderLeft: '4px solid #e74c3c' },
  ratingDisplay: { fontSize: '16px', marginTop: '8px', color: '#f57c00' },
  commentText: { fontSize: '14px', marginTop: '8px', color: '#555', fontStyle: 'italic' },
  reviewButton: { width: '100%', padding: '14px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '15px' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyText: { fontSize: '18px', color: '#999', marginBottom: '20px' },
  emptyButton: { padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '16px' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', borderRadius: '8px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' },
  modalTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 },
  modalSubtitle: { fontSize: '16px', color: '#666', marginBottom: '24px' },
  approvalToggle: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' },
  approveButton: { padding: '12px', backgroundColor: 'white', border: '2px solid #4caf50', color: '#4caf50', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  approveButtonActive: { padding: '12px', backgroundColor: '#4caf50', border: '2px solid #4caf50', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  rejectButton: { padding: '12px', backgroundColor: 'white', border: '2px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  rejectButtonActive: { padding: '12px', backgroundColor: '#e74c3c', border: '2px solid #e74c3c', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' },
  select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' },
  ratingStars: { display: 'flex', gap: '8px', fontSize: '36px' },
  star: { cursor: 'pointer', transition: 'color 0.2s' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  cancelButton: { padding: '10px 20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  saveButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  hint: { display: 'block', marginTop: '4px', fontSize: '12px', color: '#999' },
  photosSection: { marginBottom: '16px' },
  photosLabel: { fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666' },
  photosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' },
  photoLink: { display: 'block', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd' },
  photoThumb: { width: '100%', height: '120px', objectFit: 'cover', display: 'block' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default RequestsPage;
