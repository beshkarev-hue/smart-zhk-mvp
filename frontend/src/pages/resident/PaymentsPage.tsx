import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentsService } from '../../services/api';
import { authService } from '../../services/api';
import { Payment } from '../../types';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      const data = await paymentsService.getByUser(user.id);
      setPayments(data);
    } catch (error) {
      console.error('Ошибка загрузки платежей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId: string) => {
    if (!window.confirm('Оплатить этот счёт?')) return;

    try {
      await paymentsService.markAsPaid(paymentId);
      alert('✅ Платёж успешно проведён!');
      loadPayments();
    } catch (error) {
      console.error('Ошибка оплаты:', error);
      alert('❌ Ошибка при оплате');
    }
  };

  const filteredPayments = payments.filter((p) => filter === 'all' ? true : p.status === filter);
  const totalDebt = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/resident/dashboard" style={styles.backLink}>← Назад</Link>
          <h1 style={styles.title}>Платежи</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.summary}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Всего платежей</div>
            <div style={styles.summaryValue}>{payments.length}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>К оплате</div>
            <div style={{ ...styles.summaryValue, color: '#f57c00' }}>{totalDebt.toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>

        <div style={styles.filters}>
          <button onClick={() => setFilter('all')} style={{...styles.filterButton, ...(filter === 'all' && styles.filterButtonActive)}}>Все</button>
          <button onClick={() => setFilter('pending')} style={{...styles.filterButton, ...(filter === 'pending' && styles.filterButtonActive)}}>Неоплаченные</button>
          <button onClick={() => setFilter('paid')} style={{...styles.filterButton, ...(filter === 'paid' && styles.filterButtonActive)}}>Оплаченные</button>
          <button onClick={() => setFilter('overdue')} style={{...styles.filterButton, ...(filter === 'overdue' && styles.filterButtonActive)}}>Просроченные</button>
        </div>

        {filteredPayments.length === 0 ? (
          <div style={styles.empty}>Платежей не найдено</div>
        ) : (
          <div style={styles.paymentsList}>
            {filteredPayments.map((payment) => (
              <div key={payment.id} style={styles.paymentCard}>
                <div style={styles.paymentHeader}>
                  <div>
                    <div style={styles.paymentType}>{getPaymentTypeText(payment.type)}</div>
                    <div style={styles.paymentPeriod}>Период: {payment.period}</div>
                  </div>
                  <div style={{...styles.paymentStatus, ...(payment.status === 'pending' && styles.statusPending), ...(payment.status === 'paid' && styles.statusPaid), ...(payment.status === 'overdue' && styles.statusOverdue)}}>
                    {getStatusText(payment.status)}
                  </div>
                </div>

                <div style={styles.paymentBody}>
                  {payment.description && <div style={styles.paymentDescription}>{payment.description}</div>}

                  <div style={styles.paymentDetails}>
                    <div>
                      <div style={styles.detailLabel}>Сумма</div>
                      <div style={styles.paymentAmount}>{Number(payment.amount).toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div>
                      <div style={styles.detailLabel}>Срок оплаты</div>
                      <div>{new Date(payment.dueDate).toLocaleDateString('ru-RU')}</div>
                    </div>
                    {payment.paidDate && (
                      <div>
                        <div style={styles.detailLabel}>Дата оплаты</div>
                        <div>{new Date(payment.paidDate).toLocaleDateString('ru-RU')}</div>
                      </div>
                    )}
                  </div>

                  {payment.status === 'pending' && (
                    <button onClick={() => handlePayment(payment.id)} style={styles.payButton}>Оплатить</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const getPaymentTypeText = (type: string) => {
  const typeMap: Record<string, string> = {utilities: 'Коммунальные услуги', maintenance: 'Содержание и ремонт', heating: 'Отопление', water: 'Водоснабжение', electricity: 'Электроэнергия', gas: 'Газоснабжение', other: 'Прочее'};
  return typeMap[type] || type;
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {pending: 'К оплате', paid: 'Оплачено', overdue: 'Просрочено'};
  return statusMap[status] || status;
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '16px 0' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' },
  backLink: { color: '#007bff', textDecoration: 'none', fontSize: '16px' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' },
  summaryCard: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  summaryLabel: { fontSize: '14px', color: '#666', marginBottom: '8px' },
  summaryValue: { fontSize: '32px', fontWeight: 'bold' },
  filters: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  filterButton: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  filterButtonActive: { backgroundColor: '#007bff', color: 'white', borderColor: '#007bff' },
  paymentsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  paymentCard: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  paymentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' },
  paymentType: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' },
  paymentPeriod: { fontSize: '14px', color: '#666' },
  paymentStatus: { padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '500' },
  statusPending: { backgroundColor: '#fff3e0', color: '#f57c00' },
  statusPaid: { backgroundColor: '#e8f5e9', color: '#388e3c' },
  statusOverdue: { backgroundColor: '#ffebee', color: '#d32f2f' },
  paymentBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
  paymentDescription: { fontSize: '14px', color: '#666' },
  paymentDetails: { display: 'flex', gap: '32px', flexWrap: 'wrap' },
  detailLabel: { fontSize: '12px', color: '#666', marginBottom: '4px' },
  paymentAmount: { fontSize: '24px', fontWeight: 'bold', color: '#007bff' },
  payButton: { padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', alignSelf: 'flex-start' },
  empty: { textAlign: 'center', padding: '40px', color: '#666' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
};

export default PaymentsPage;
