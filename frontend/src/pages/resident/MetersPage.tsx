import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gisZhkhService } from '../../services/api';

interface Meter {
  id: string;
  meterType: string;
  meterNumber: string;
  installDate: string;
  nextCheckDate: string;
  currentValue: number;
  isActive: boolean;
}

interface MeterReading {
  meterId: string;
  meterType: string;
  readingDate: string;
  value: number;
  previousValue: number;
  consumption: number;
  tariff: number;
  amount: number;
}

const MetersPage: React.FC = () => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitMode, setSubmitMode] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [newValue, setNewValue] = useState('');

  const accountNumber = '123456789';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metersData, readingsData] = await Promise.all([
        gisZhkhService.getMeters(accountNumber),
        gisZhkhService.getMeterReadings(accountNumber),
      ]);

      if (metersData.success) {
        setMeters(metersData.meters);
      }

      if (readingsData.success) {
        setReadings(readingsData.readings);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReading = async () => {
    if (!selectedMeter) {
      alert('Счётчик не выбран');
      return;
    }
    
    if (!newValue) {
      alert('Введите показания');
      return;
    }

    const newVal = parseFloat(newValue);
    if (newVal <= selectedMeter.currentValue) {
      alert(`Новое значение должно быть больше текущего: ${selectedMeter.currentValue}`);
      return;
    }

    try {
      console.log("Отправка:", { accountNumber, meterId: selectedMeter.id, value: newVal }); const result = await gisZhkhService.submitMeterReading({
        accountNumber,
        meterId: selectedMeter.id,
        value: newVal,
        readingDate: new Date().toISOString(),
      });

      if (result.success) {
        alert('✅ Показания успешно переданы!');
        setSubmitMode(false);
        setSelectedMeter(null);
        setNewValue('');
        loadData();
      }
    } catch (error) {
      console.error('Ошибка передачи показаний:', error);
      alert('❌ Ошибка передачи показаний');
    }
  };

  const getMeterIcon = (type: string) => {
    const icons: Record<string, string> = {
      water_cold: '❄️',
      water_hot: '♨️',
      electricity: '⚡',
      gas: '🔥',
    };
    return icons[type] || '📊';
  };

  const getMeterName = (type: string) => {
    const names: Record<string, string> = {
      water_cold: 'Холодная вода',
      water_hot: 'Горячая вода',
      electricity: 'Электричество',
      gas: 'Газ',
    };
    return names[type] || type;
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Показания счётчиков</h1>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Мои приборы учёта</h2>
          <div style={styles.metersList}>
            {meters.map((meter) => (
              <div key={meter.id} style={styles.meterCard}>
                <div style={styles.meterHeader}>
                  <div style={styles.meterIcon}>{getMeterIcon(meter.meterType)}</div>
                  <div style={styles.meterInfo}>
                    <div style={styles.meterName}>{getMeterName(meter.meterType)}</div>
                    <div style={styles.meterNumber}>№ {meter.meterNumber}</div>
                  </div>
                </div>

                <div style={styles.meterDetails}>
                  <div style={styles.meterValue}>
                    <div style={styles.valueLabel}>Текущие показания</div>
                    <div style={styles.valueNumber}>{meter.currentValue}</div>
                  </div>

                  <div style={styles.meterDates}>
                    <div style={styles.dateItem}>
                      <span style={styles.dateLabel}>Поверка до:</span>
                      <span>{new Date(meter.nextCheckDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMeter(meter);
                    setSubmitMode(true);
                  }}
                  style={styles.submitButton}
                >
                  Передать показания
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>История показаний</h2>
          <div style={styles.readingsList}>
            {readings.map((reading, idx) => (
              <div key={idx} style={styles.readingCard}>
                <div style={styles.readingHeader}>
                  <div>{getMeterIcon(reading.meterType)} {getMeterName(reading.meterType)}</div>
                  <div style={styles.readingDate}>
                    {new Date(reading.readingDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>

                <div style={styles.readingDetails}>
                  <div style={styles.readingItem}>
                    <span style={styles.readingLabel}>Показания:</span>
                    <span style={styles.readingValue}>{reading.value}</span>
                  </div>
                  <div style={styles.readingItem}>
                    <span style={styles.readingLabel}>Расход:</span>
                    <span style={styles.readingValue}>{reading.consumption}</span>
                  </div>
                  <div style={styles.readingItem}>
                    <span style={styles.readingLabel}>К оплате:</span>
                    <span style={styles.readingAmount}>{reading.amount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {submitMode && selectedMeter && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Передать показания</h3>
            <p style={styles.modalSubtitle}>
              {getMeterIcon(selectedMeter.meterType)} {getMeterName(selectedMeter.meterType)}
            </p>
            <p style={styles.modalInfo}>
              Текущие показания: <strong>{selectedMeter.currentValue}</strong>
            </p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Новые показания</label>
              <input
                type="number"
                step="0.01"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                style={styles.input}
                placeholder="Введите показания"
              />
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => { setSubmitMode(false); setSelectedMeter(null); setNewValue(''); }} style={styles.cancelButton}>
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
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: '#007bff', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
  metersList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  meterCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  meterHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  meterIcon: { fontSize: '40px' },
  meterInfo: { flex: 1 },
  meterName: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' },
  meterNumber: { fontSize: '14px', color: '#666' },
  meterDetails: { marginBottom: '20px' },
  meterValue: { backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' },
  valueLabel: { fontSize: '14px', color: '#666', marginBottom: '8px' },
  valueNumber: { fontSize: '32px', fontWeight: 'bold', color: '#007bff' },
  meterDates: { fontSize: '14px' },
  dateItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' },
  dateLabel: { color: '#666' },
  submitButton: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' },
  readingsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  readingCard: { backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  readingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #eee' },
  readingDate: { fontSize: '14px', color: '#666' },
  readingDetails: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  readingItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  readingLabel: { fontSize: '12px', color: '#666' },
  readingValue: { fontSize: '18px', fontWeight: 'bold' },
  readingAmount: { fontSize: '18px', fontWeight: 'bold', color: '#28a745' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', borderRadius: '8px', padding: '32px', maxWidth: '500px', width: '90%' },
  modalTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', marginTop: 0 },
  modalSubtitle: { fontSize: '18px', color: '#666', marginBottom: '16px' },
  modalInfo: { fontSize: '16px', marginBottom: '24px' },
  inputGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelButton: { padding: '12px 24px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
  confirmButton: { padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default MetersPage;
