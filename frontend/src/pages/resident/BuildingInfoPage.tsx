import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, buildingsService } from '../../services/api';
import Logo from '../../components/Logo';
import { colors } from '../../theme/colors';

const BuildingInfoPage: React.FC = () => {
  const [building, setBuilding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user?.buildingAddress) {
        const buildingData = await buildingsService.getByAddress(user.buildingAddress);
        setBuilding(buildingData);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <Logo size="large" showText={false} />
        </div>
      </header>

      <main style={styles.main}>
        <h1 style={styles.title}>О доме</h1>

        <section style={styles.tabsSection}>
          <button onClick={() => setActiveTab('info')} style={activeTab === 'info' ? styles.tabActive : styles.tab}>
            🏢 Информация
          </button>
          <button onClick={() => setActiveTab('rules')} style={activeTab === 'rules' ? styles.tabActive : styles.tab}>
            📜 Правила
          </button>
          <button onClick={() => setActiveTab('tariffs')} style={activeTab === 'tariffs' ? styles.tabActive : styles.tab}>
            💰 Тарифы
          </button>
          <button onClick={() => setActiveTab('contact')} style={activeTab === 'contact' ? styles.tabActive : styles.tab}>
            📞 Контакты УК
          </button>
        </section>

        {activeTab === 'info' && building && (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Информация о доме</h2>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Адрес:</span>
                <span style={styles.infoValue}>{building.address}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Лицевой счёт:</span>
                <span style={styles.infoValue}>{building.accountNumber || 'Не указан'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Год постройки:</span>
                <span style={styles.infoValue}>{building.yearBuilt || 'Не указан'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Этажность:</span>
                <span style={styles.infoValue}>{building.floors || 'Не указана'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Подъездов:</span>
                <span style={styles.infoValue}>{building.entrances || 'Не указано'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Квартир:</span>
                <span style={styles.infoValue}>{building.totalApartments || 'Не указано'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Материал стен:</span>
                <span style={styles.infoValue}>{building.wallMaterial || 'Не указан'}</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'rules' && building && (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Правила проживания</h2>
            <div style={styles.rulesText}>
              {building.houseRules || 'Правила проживания будут добавлены администратором'}
            </div>
          </section>
        )}

        {activeTab === 'tariffs' && building?.tariffs && (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Тарифы ЖКУ</h2>
            <div style={styles.tariffsGrid}>
              <div style={styles.tariffCard}>
                <div style={styles.tariffIcon}>💧</div>
                <div style={styles.tariffName}>Холодная вода</div>
                <div style={styles.tariffValue}>{building.tariffs.coldWater} ₽/м³</div>
              </div>
              <div style={styles.tariffCard}>
                <div style={styles.tariffIcon}>🔥</div>
                <div style={styles.tariffName}>Горячая вода</div>
                <div style={styles.tariffValue}>{building.tariffs.hotWater} ₽/м³</div>
              </div>
              <div style={styles.tariffCard}>
                <div style={styles.tariffIcon}>⚡</div>
                <div style={styles.tariffName}>Электроэнергия (день)</div>
                <div style={styles.tariffValue}>{building.tariffs.electricity.day} ₽/кВт·ч</div>
              </div>
              <div style={styles.tariffCard}>
                <div style={styles.tariffIcon}>🌙</div>
                <div style={styles.tariffName}>Электроэнергия (ночь)</div>
                <div style={styles.tariffValue}>{building.tariffs.electricity.night} ₽/кВт·ч</div>
              </div>
              <div style={styles.tariffCard}>
                <div style={styles.tariffIcon}>🔆</div>
                <div style={styles.tariffName}>Электроэнергия (пик)</div>
                <div style={styles.tariffValue}>{building.tariffs.electricity.peak} ₽/кВт·ч</div>
              </div>
              <div style={styles.tariffCard}>
                <div style={styles.tariffIcon}>🔥</div>
                <div style={styles.tariffName}>Газ</div>
                <div style={styles.tariffValue}>{building.tariffs.gas} ₽/м³</div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'contact' && building?.managementCompany && (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Контакты управляющей компании</h2>
            <div style={styles.contactCard}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🏢</span>
                <div>
                  <div style={styles.contactLabel}>Название</div>
                  <div style={styles.contactValue}>{building.managementCompany.name}</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <div>
                  <div style={styles.contactLabel}>Телефон</div>
                  <div style={styles.contactValue}>{building.managementCompany.phone}</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <div>
                  <div style={styles.contactLabel}>Email</div>
                  <div style={styles.contactValue}>{building.managementCompany.email}</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <div>
                  <div style={styles.contactLabel}>Адрес офиса</div>
                  <div style={styles.contactValue}>{building.managementCompany.address}</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🕐</span>
                <div>
                  <div style={styles.contactLabel}>Часы работы</div>
                  <div style={styles.contactValue}>{building.managementCompany.workingHours}</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: 'rgba(124, 179, 66, 0.08)' },
  header: { backgroundColor: 'rgba(124, 179, 66, 0.2)', borderBottom: `2px solid ${colors.primary}`, padding: '12px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: colors.text, textDecoration: 'none', fontSize: '16px', fontWeight: '600' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: colors.text },
  tabsSection: { display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' },
  tab: { padding: '12px 24px', backgroundColor: 'white', border: `2px solid ${colors.light}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: colors.text },
  tabActive: { padding: '12px 24px', backgroundColor: colors.secondary, color: 'white', border: `2px solid ${colors.secondary}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  content: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: colors.text },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  infoItem: { display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: colors.light, borderRadius: '8px' },
  infoLabel: { fontWeight: '600', color: colors.textLight },
  infoValue: { fontWeight: '500', color: colors.text },
  rulesText: { fontSize: '16px', lineHeight: '1.8', color: colors.text, whiteSpace: 'pre-wrap' },
  tariffsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  tariffCard: { backgroundColor: colors.light, borderRadius: '12px', padding: '24px', textAlign: 'center' },
  tariffIcon: { fontSize: '48px', marginBottom: '12px' },
  tariffName: { fontSize: '14px', color: colors.textLight, marginBottom: '8px' },
  tariffValue: { fontSize: '24px', fontWeight: 'bold', color: colors.primary },
  contactCard: { display: 'flex', flexDirection: 'column', gap: '24px' },
  contactItem: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
  contactIcon: { fontSize: '32px' },
  contactLabel: { fontSize: '14px', color: colors.textLight, marginBottom: '4px' },
  contactValue: { fontSize: '16px', fontWeight: '600', color: colors.text },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default BuildingInfoPage;
