import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { User } from '../../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!user) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Профиль</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>👤</div>
            <h2 style={styles.userName}>{user.firstName} {user.lastName}</h2>
            <p style={styles.userRole}>Жилец</p>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Личные данные</h3>
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Фамилия</div>
                <div style={styles.infoValue}>{user.lastName}</div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Имя</div>
                <div style={styles.infoValue}>{user.firstName}</div>
              </div>

              {user.middleName && (
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Отчество</div>
                  <div style={styles.infoValue}>{user.middleName}</div>
                </div>
              )}

              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValue}>{user.email}</div>
              </div>

              {user.phone && (
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Телефон</div>
                  <div style={styles.infoValue}>{user.phone}</div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Адрес</h3>
            
            <div style={styles.infoGrid}>
              {user.buildingAddress && (
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Дом</div>
                  <div style={styles.infoValue}>{user.buildingAddress}</div>
                </div>
              )}

              {user.apartmentNumber && (
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Квартира</div>
                  <div style={styles.infoValue}>{user.apartmentNumber}</div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Статус аккаунта</h3>
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Статус</div>
                <div style={{...styles.infoValue, color: user.isActive ? '#28a745' : '#dc3545'}}>
                  {user.isActive ? '✓ Активен' : '✗ Неактивен'}
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Дата регистрации</div>
                <div style={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: '#007bff', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  main: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  avatarSection: { textAlign: 'center', paddingBottom: '32px', borderBottom: '1px solid #eee', marginBottom: '32px' },
  avatar: { fontSize: '80px', marginBottom: '16px' },
  userName: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 },
  userRole: { color: '#666', margin: 0 },
  infoSection: { marginBottom: '32px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', marginTop: 0 },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' },
  infoItem: {},
  infoLabel: { fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '16px', fontWeight: '500' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default ProfilePage;
