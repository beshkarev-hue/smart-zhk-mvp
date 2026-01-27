import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { metersService } from '../../services/api';
import Logo from '../../components/Logo';
import { colors } from '../../theme/colors';

const MetersPage: React.FC = () => {
  const [meters, setMeters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'water' | 'electricity'>('water');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  const [newReading, setNewReading] = useState('');
  const [newReadingT1, setNewReadingT1] = useState('');
  const [newReadingT2, setNewReadingT2] = useState('');
  const [newReadingT3, setNewReadingT3] = useState('');

  useEffect(() => {
    loadMeters();
  }, []);

  const loadMeters = async () => {
    try {
      const data = await metersService.getMyMeters();
      setMeters(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (meter: any) => {
    setSelectedMeter(meter);
    if (meter.type === 'electricity') {
      setNewReadingT1(meter.currentReadingT1?.toString() || '');
      setNewReadingT2(meter.currentReadingT2?.toString() || '');
      setNewReadingT3(meter.currentReadingT3?.toString() || '');
    } else {
      setNewReading(meter.currentReading?.toString() || '');
    }
    setShowSubmitModal(true);
  };

  const handleSubmitReading = async () => {
    if (!selectedMeter) return;
    
    try {
      if (selectedMeter.type === 'electricity') {
        if (!newReadingT1 || !newReadingT2 || !newReadingT3) {
          alert('Заполните все показания T1, T2, T3');
          return;
        }
        await metersService.submitReading(selectedMeter.id, {
          readingT1: parseFloat(newReadingT1),
          readingT2: parseFloat(newReadingT2),
          readingT3: parseFloat(newReadingT3),
        });
      } else {
        if (!newReading) {
          alert('Укажите показания счётчика');
          return;
        }
        await metersService.submitReading(selectedMeter.id, parseFloat(newReading));
      }
      
      alert('✅ Показания успешно переданы!');
      setShowSubmitModal(false);
      setSelectedMeter(null);
      setNewReading('');
      setNewReadingT1('');
      setNewReadingT2('');
      setNewReadingT3('');
      loadMeters();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка передачи показаний');
    }
  };

  const waterMeters = meters.filter(m => m.type === 'cold_water' || m.type === 'hot_water');
  const electricityMeters = meters.filter(m => m.type === 'electricity');

  const getMeterTypeName = (type: string) => {
    const names: Record<string, string> = {
      cold_water: 'Холодная вода',
      hot_water: 'Горячая вода',
      electricity: 'Электроэнергия',
      gas: 'Газ',
    };
    return names[type] || type;
  };

  const getMeterIcon = (type: string) => {
    const icons: Record<string, string> = {
      cold_water: '💧',
      hot_water: '🔥',
      electricity: '⚡',
      gas: '🔥',
    };
    return icons[type] || '📊';
  };

  const isVerificationExpiringSoon = (nextDate: string) => {
    const date = new Date(nextDate);
    const today = new Date();
    const monthsLeft = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsLeft < 6;
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
        <h1 style={styles.title}>Показания счётчиков</h1>

        <section style={styles.tabsSection}>
          <button 
            onClick={() => setActiveTab('water')} 
            style={activeTab === 'water' ? styles.tabActive : styles.tab}
          >
            💧 Вода ({waterMeters.length})
          </button>
          <button 
            onClick={() => setActiveTab('electricity')} 
            style={activeTab === 'electricity' ? styles.tabActive : styles.tab}
          >
            ⚡ Электроэнергия ({electricityMeters.length})
          </button>
        </section>

        {activeTab === 'water' && (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Счётчики воды</h2>
            {waterMeters.length > 0 ? (
              <div style={styles.metersGrid}>
                {waterMeters.map((meter, index) => {
                  const current = Number(meter.currentReading);
                  const previous = meter.previousReading ? Number(meter.previousReading) : 0;
                  const consumption = current - previous;
                  const isExpiring = meter.nextVerificationDate && isVerificationExpiringSoon(meter.nextVerificationDate);
                  
                  const coldWaterMeters = waterMeters.filter(m => m.type === 'cold_water');
                  const hotWaterMeters = waterMeters.filter(m => m.type === 'hot_water');
                  let pipeNumber = '';
                  if (meter.type === 'cold_water' && coldWaterMeters.length > 1) {
                    const coldIndex = coldWaterMeters.findIndex(m => m.id === meter.id);
                    pipeNumber = ` (Стояк ${coldIndex + 1})`;
                  } else if (meter.type === 'hot_water' && hotWaterMeters.length > 1) {
                    const hotIndex = hotWaterMeters.findIndex(m => m.id === meter.id);
                    pipeNumber = ` (Стояк ${hotIndex + 1})`;
                  }
                  
                  return (
                    <div key={meter.id} style={styles.meterCard}>
                      <div style={styles.meterHeader}>
                        <span style={styles.meterIcon}>{getMeterIcon(meter.type)}</span>
                        <div>
                          <div style={styles.meterType}>{getMeterTypeName(meter.type)}</div>
                          <div style={styles.meterSubtitle}>Счётчик #{index + 1}{pipeNumber}</div>
                        </div>
                      </div>

                      <div style={styles.meterInfo}>
                        <div style={styles.meterRow}>
                          <span style={styles.meterLabel}>Серийный номер:</span>
                          <span style={styles.meterValue}>{meter.serialNumber}</span>
                        </div>
                        
                        <div style={styles.readingsSection}>
                          <div style={styles.readingCard}>
                            <div style={styles.readingLabel}>Текущие показания</div>
                            <div style={styles.readingValue}>{current.toFixed(2)} м³</div>
                          </div>
                          <div style={styles.readingCard}>
                            <div style={styles.readingLabel}>Предыдущие</div>
                            <div style={styles.readingValue}>{previous > 0 ? previous.toFixed(2) : '-'} м³</div>
                          </div>
                          <div style={styles.consumptionCard}>
                            <div style={styles.readingLabel}>Расход за месяц</div>
                            <div style={styles.consumptionValue}>{consumption.toFixed(2)} м³</div>
                          </div>
                        </div>

                        {meter.nextVerificationDate && (
                          <div style={isExpiring ? styles.verificationWarning : styles.verificationInfo}>
                            <span style={styles.verificationIcon}>{isExpiring ? '⚠️' : '✓'}</span>
                            <div>
                              <div style={styles.verificationLabel}>Следующая поверка:</div>
                              <div style={styles.verificationDate}>
                                {new Date(meter.nextVerificationDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        )}

                        <button onClick={() => handleOpenSubmit(meter)} style={styles.submitButton}>Передать показания</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>Счётчики воды не найдены</div>
            )}
          </section>
        )}

        {activeTab === 'electricity' && (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Счётчики электроэнергии</h2>
            {electricityMeters.length > 0 ? (
              <div style={styles.metersGrid}>
                {electricityMeters.map((meter, index) => {
                  const isExpiring = meter.nextVerificationDate && isVerificationExpiringSoon(meter.nextVerificationDate);
                  const t1Current = meter.currentReadingT1 ? Number(meter.currentReadingT1) : 0;
                  const t2Current = meter.currentReadingT2 ? Number(meter.currentReadingT2) : 0;
                  const t3Current = meter.currentReadingT3 ? Number(meter.currentReadingT3) : 0;
                  const t1Previous = meter.previousReadingT1 ? Number(meter.previousReadingT1) : 0;
                  const t2Previous = meter.previousReadingT2 ? Number(meter.previousReadingT2) : 0;
                  const t3Previous = meter.previousReadingT3 ? Number(meter.previousReadingT3) : 0;
                  const t1Consumption = t1Current - t1Previous;
                  const t2Consumption = t2Current - t2Previous;
                  const t3Consumption = t3Current - t3Previous;
                  const totalConsumption = t1Consumption + t2Consumption + t3Consumption;
                  
                  return (
                    <div key={meter.id} style={styles.meterCardWide}>
                      <div style={styles.meterHeader}>
                        <span style={styles.meterIcon}>{getMeterIcon(meter.type)}</span>
                        <div>
                          <div style={styles.meterType}>{getMeterTypeName(meter.type)}</div>
                          <div style={styles.meterSubtitle}>Трёхтарифный счётчик #{index + 1}</div>
                        </div>
                      </div>

                      <div style={styles.meterInfo}>
                        <div style={styles.meterRow}>
                          <span style={styles.meterLabel}>Номер прибора учёта:</span>
                          <span style={styles.meterValue}>{meter.serialNumber}</span>
                        </div>
                        {meter.electricityAccountNumber && (
                          <div style={styles.meterRow}>
                            <span style={styles.meterLabel}>Лицевой счёт:</span>
                            <span style={styles.meterValue}>{meter.electricityAccountNumber}</span>
                          </div>
                        )}
                        
                        <div style={styles.tariffNote}>
                          💡 Трёхтарифный учёт электроэнергии
                        </div>

                        <div style={styles.tariffsGrid}>
                          <div style={styles.tariffCard}>
                            <div style={styles.tariffHeader}>Т1 (Пик)</div>
                            <div style={styles.tariffReadings}>
                              <div style={styles.tariffRow}>
                                <span style={styles.tariffLabel}>Текущие:</span>
                                <span style={styles.tariffValue}>{t1Current.toFixed(2)}</span>
                              </div>
                              <div style={styles.tariffRow}>
                                <span style={styles.tariffLabel}>Предыдущие:</span>
                                <span style={styles.tariffValue}>{t1Previous.toFixed(2)}</span>
                              </div>
                              <div style={styles.consumptionBadge}>
                                Расход: {t1Consumption.toFixed(2)} кВт·ч
                              </div>
                            </div>
                          </div>

                          <div style={styles.tariffCard}>
                            <div style={styles.tariffHeader}>Т2 (День)</div>
                            <div style={styles.tariffReadings}>
                              <div style={styles.tariffRow}>
                                <span style={styles.tariffLabel}>Текущие:</span>
                                <span style={styles.tariffValue}>{t2Current.toFixed(2)}</span>
                              </div>
                              <div style={styles.tariffRow}>
                                <span style={styles.tariffLabel}>Предыдущие:</span>
                                <span style={styles.tariffValue}>{t2Previous.toFixed(2)}</span>
                              </div>
                              <div style={styles.consumptionBadge}>
                                Расход: {t2Consumption.toFixed(2)} кВт·ч
                              </div>
                            </div>
                          </div>

                          <div style={styles.tariffCard}>
                            <div style={styles.tariffHeader}>Т3 (Ночь)</div>
                            <div style={styles.tariffReadings}>
                              <div style={styles.tariffRow}>
                                <span style={styles.tariffLabel}>Текущие:</span>
                                <span style={styles.tariffValue}>{t3Current.toFixed(2)}</span>
                              </div>
                              <div style={styles.tariffRow}>
                                <span style={styles.tariffLabel}>Предыдущие:</span>
                                <span style={styles.tariffValue}>{t3Previous.toFixed(2)}</span>
                              </div>
                              <div style={styles.consumptionBadge}>
                                Расход: {t3Consumption.toFixed(2)} кВт·ч
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={styles.totalConsumption}>
                          Общий расход за месяц: <strong>{totalConsumption.toFixed(2)} кВт·ч</strong>
                        </div>

                        {meter.nextVerificationDate && (
                          <div style={isExpiring ? styles.verificationWarning : styles.verificationInfo}>
                            <span style={styles.verificationIcon}>{isExpiring ? '⚠️' : '✓'}</span>
                            <div>
                              <div style={styles.verificationLabel}>Следующая поверка:</div>
                              <div style={styles.verificationDate}>
                                {new Date(meter.nextVerificationDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        )}

                        <button onClick={() => handleOpenSubmit(meter)} style={styles.submitButton}>Передать показания</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>Счётчики электроэнергии не найдены</div>
            )}
          </section>
        )}
      </main>

      {showSubmitModal && selectedMeter && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Передать показания</h2>
            <p style={styles.modalSubtitle}>
              {getMeterTypeName(selectedMeter.type)} - {selectedMeter.serialNumber}
            </p>

            {selectedMeter.type === 'electricity' ? (
              <div style={styles.modalContent}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>T1 (Пик):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReadingT1}
                    onChange={(e) => setNewReadingT1(e.target.value)}
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>T2 (День):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReadingT2}
                    onChange={(e) => setNewReadingT2(e.target.value)}
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>T3 (Ночь):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReadingT3}
                    onChange={(e) => setNewReadingT3(e.target.value)}
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ) : (
              <div style={styles.modalContent}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Показания счётчика:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReading}
                    onChange={(e) => setNewReading(e.target.value)}
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            <div style={styles.modalButtons}>
              <button onClick={() => setShowSubmitModal(false)} style={styles.cancelButton}>
                Отмена
              </button>
              <button onClick={handleSubmitReading} style={styles.confirmButton}>
                Отправить
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
  metersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
  meterCard: { backgroundColor: colors.light, borderRadius: '12px', padding: '24px', border: `2px solid ${colors.light}` },
  meterCardWide: { backgroundColor: colors.light, borderRadius: '12px', padding: '24px', border: `2px solid ${colors.light}`, gridColumn: '1 / -1' },
  meterHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid white` },
  meterIcon: { fontSize: '48px' },
  meterType: { fontSize: '20px', fontWeight: 'bold', color: colors.primary },
  meterSubtitle: { fontSize: '14px', color: colors.textLight },
  meterInfo: { display: 'flex', flexDirection: 'column', gap: '16px' },
  meterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  meterLabel: { fontSize: '14px', color: colors.textLight },
  meterValue: { fontSize: '14px', fontWeight: '600', color: colors.text },
  readingsSection: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  readingCard: { backgroundColor: 'white', borderRadius: '8px', padding: '12px', textAlign: 'center' },
  readingLabel: { fontSize: '12px', color: colors.textLight, marginBottom: '8px' },
  readingValue: { fontSize: '18px', fontWeight: 'bold', color: colors.text },
  consumptionCard: { backgroundColor: colors.primary, borderRadius: '8px', padding: '12px', textAlign: 'center' },
  consumptionValue: { fontSize: '18px', fontWeight: 'bold', color: 'white' },
  tariffNote: { backgroundColor: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#e65100', textAlign: 'center', fontWeight: '500' },
  tariffsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' },
  tariffCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px', border: '2px solid #e3f2fd' },
  tariffHeader: { fontSize: '16px', fontWeight: 'bold', color: colors.secondary, marginBottom: '12px', textAlign: 'center' },
  tariffReadings: { display: 'flex', flexDirection: 'column', gap: '8px' },
  tariffRow: { display: 'flex', justifyContent: 'space-between' },
  tariffLabel: { fontSize: '12px', color: colors.textLight },
  tariffValue: { fontSize: '16px', fontWeight: 'bold', color: colors.text },
  consumptionBadge: { backgroundColor: colors.primary, color: 'white', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textAlign: 'center', marginTop: '8px' },
  totalConsumption: { backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', fontSize: '16px', textAlign: 'center', color: colors.primary },
  verificationInfo: { display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '8px' },
  verificationWarning: { display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#fff3e0', padding: '12px', borderRadius: '8px', border: '2px solid #ff9800' },
  verificationIcon: { fontSize: '24px' },
  verificationLabel: { fontSize: '12px', color: colors.textLight },
  verificationDate: { fontSize: '14px', fontWeight: '600', color: colors.text },
  submitButton: { width: '100%', padding: '14px', backgroundColor: colors.secondary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: colors.textLight, fontSize: '18px' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  modalOverlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', maxWidth: '500px', width: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0, color: colors.text },
  modalSubtitle: { fontSize: '14px', color: colors.textLight, marginBottom: '24px' },
  modalContent: { marginBottom: '24px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: colors.text },
  input: { width: '100%', padding: '12px', border: '2px solid ' + colors.light, borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' as const },
  modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelButton: { padding: '12px 24px', backgroundColor: colors.light, color: colors.text, border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  confirmButton: { padding: '12px 24px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
};

export default MetersPage;
