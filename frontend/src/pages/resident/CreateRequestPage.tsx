import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { requestsService } from '../../services/api';
import { authService } from '../../services/api';
import { RequestType } from '../../types';

const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    type: 'repair' as RequestType,
    title: '',
    description: '',
    apartmentNumber: user?.apartmentNumber || '',
    buildingAddress: user?.buildingAddress || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestsService.create({
        ...formData,
        userId: user?.id,
      });

      alert('✅ Заявка успешно создана!');
      navigate('/resident/requests');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка создания заявки');
      console.error('❌ Ошибка создания заявки:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/requests" style={styles.backLink}>
            ← Назад к заявкам
          </Link>
          <h1 style={styles.title}>Создать заявку</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Тип заявки *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="repair">🔨 Ремонт</option>
                <option value="plumbing">🚰 Сантехника</option>
                <option value="electricity">💡 Электрика</option>
                <option value="heating">🔥 Отопление</option>
                <option value="cleaning">🧹 Уборка</option>
                <option value="garbage">🗑️ Вывоз мусора</option>
                <option value="elevator">🛗 Лифт</option>
                <option value="intercom">📞 Домофон</option>
                <option value="other">📝 Другое</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Заголовок *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Кратко опишите проблему"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Описание проблемы *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={styles.textarea}
                rows={6}
                placeholder="Подробно опишите проблему: что случилось, когда, где именно..."
              />
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Адрес дома</label>
                <input
                  type="text"
                  name="buildingAddress"
                  value={formData.buildingAddress}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Номер квартиры</label>
                <input
                  type="text"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => navigate('/resident/requests')}
                style={styles.cancelButton}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.submitButtonDisabled),
                }}
              >
                {loading ? 'Создание...' : 'Создать заявку'}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.tips}>
          <h3 style={styles.tipsTitle}>💡 Советы по заполнению</h3>
          <ul style={styles.tipsList}>
            <li>Укажите точное местоположение проблемы</li>
            <li>Опишите когда проблема началась</li>
            <li>Добавьте важные детали (звуки, запахи, видимые повреждения)</li>
            <li>Укажите если проблема требует срочного решения</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #ddd',
    padding: '16px 0',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  backLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '32px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  select: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    fontSize: '14px',
  },
  tips: {
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    padding: '24px',
  },
  tipsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    marginTop: 0,
  },
  tipsList: {
    margin: 0,
    paddingLeft: '24px',
    lineHeight: 1.8,
  },
};

export default CreateRequestPage;
